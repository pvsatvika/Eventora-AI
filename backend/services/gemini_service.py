import os
import re
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
from fastapi import HTTPException
from google import genai
from google.genai import types
from google.genai.errors import APIError

from models.schemas import (
    EventPlanRequest,
    GenerateIdeasRequest,
    GeminiPlanOutputSchema,
    GeminiIdeasOutputSchema,
)

# Absolute path to backend/.env derived from pathlib.Path(__file__)
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"

def load_backend_env() -> None:
    """Ensure backend/.env is loaded using an absolute path with override=True."""
    if ENV_PATH.is_file():
        load_dotenv(dotenv_path=ENV_PATH, override=True)

# Initial load on module import
load_backend_env()

KNOWN_PLACEHOLDERS = {
    "YOUR_API_KEY_HERE",
    "YOUR_ACTUAL_GEMINI_API_KEY",
    "PLACEHOLDER",
    "YOUR_GEMINI_API_KEY",
    "CHANGE_ME",
    "YOUR_KEY_HERE",
    "ENTER_YOUR_API_KEY_HERE",
}

# Fallback palette colors for budget categories
PALETTE_COLORS = [
    "#526B57",  # Dark Sage
    "#748C78",  # Sage Green
    "#CB8C82",  # Terracotta Blush
    "#90A893",  # Light Sage
    "#607664",  # Forest Moss
    "#B56E63",  # Deep Blush
    "#69716B",  # Muted Slate
    "#3D5041",  # Deep Olive
]


def extract_clean_json(text: str) -> str:
    """
    Safely extract JSON text from Gemini responses, stripping markdown code fences
    (e.g., ```json ... ```) and leading/trailing non-JSON whitespace.
    """
    if not text:
        return ""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip().startswith("```"):
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()
    return cleaned


def sanitize_error_message(msg: str) -> str:
    """
    Ensure no raw API keys, bearer tokens, or query strings leak in error messages.
    """
    if not msg:
        return "An unknown error occurred."
    # Redact any Google API keys (AIzaSy...)
    msg = re.sub(r"AIza[0-9A-Za-z_-]{35}", "[REDACTED_API_KEY]", msg)
    # Redact any ?key=... query parameters
    msg = re.sub(r"key=[^&\s'\"]+", "key=[REDACTED]", msg)
    return msg


def get_api_key() -> Optional[str]:
    """
    Retrieve GEMINI_API_KEY from environment or backend/.env.
    Guarantees that placeholder environment variables do not mask a valid .env value,
    and dynamically reloads backend/.env if needed.
    """
    key = os.getenv("GEMINI_API_KEY", "").strip().strip("\"'")
    if not key or key.upper() in KNOWN_PLACEHOLDERS:
        load_backend_env()
        key = os.getenv("GEMINI_API_KEY", "").strip().strip("\"'")

    if not key or key.upper() in KNOWN_PLACEHOLDERS:
        return None
    return key


def get_model_name() -> str:
    """Retrieve GEMINI_MODEL or fallback to standard Flash model."""
    return os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip() or "gemini-2.5-flash"


def is_gemini_configured() -> bool:
    """Check whether a non-placeholder Gemini API key is configured."""
    return get_api_key() is not None


def normalize_timeline_tasks(
    raw_tasks: List[TimelineTaskGemini],
    today: datetime.date,
    event_date: datetime.date,
    existing_completed_tasks: Optional[List[str]] = None,
) -> List[Dict[str, Any]]:
    """
    Validate and normalize AI-generated tasks:
    1. Ensure no pre-event task is in the past relative to today.
    2. Reschedule any traditional milestones that would be overdue to upcoming actionable dates.
    3. Allow post-event tasks to have dates after the event date.
    4. Preserve previously completed task states across regenerations.
    5. Chronologically sort all deliverables by due date.
    """
    days_until_event = (event_date - today).days
    completed_set = set()
    if existing_completed_tasks:
        completed_set = {t.strip().lower() for t in existing_completed_tasks if t.strip()}

    normalized = []
    for idx, t in enumerate(raw_tasks):
        is_post_event = (
            "post" in t.phase.lower()
            or "after" in t.phase.lower()
            or t.days_before_event < 0
        )

        if is_post_event:
            # Post-event task (e.g. settlements, thank-you cards, album delivery)
            days_after = abs(t.days_before_event) if t.days_before_event != 0 else 3
            days_after = min(max(days_after, 1), 30)  # Between 1 and 30 days post-event
            due_dt = event_date + timedelta(days=days_after)
            phase = "Post Event"
            priority = t.priority
            notes = t.notes
        else:
            # Pre-event or day-of deliverable
            nominal_dt = event_date - timedelta(days=max(0, t.days_before_event))

            if nominal_dt < today:
                # Milestone date falls in the past relative to current server date
                # Reschedule to an upcoming actionable date between today and event date
                if days_until_event <= 0:
                    due_dt = today
                else:
                    offset = min((idx % 3) + 1, max(1, days_until_event))
                    due_dt = today + timedelta(days=offset)
                    if due_dt > event_date:
                        due_dt = event_date

                priority = "high"
                phase = (
                    "Immediate Action (This Week)"
                    if days_until_event > 14
                    else "Immediate Priority"
                )
                notice = " [Urgent: Rescheduled to upcoming priority as celebration date is approaching]"
                notes = (t.notes or "") + notice
            elif nominal_dt > event_date:
                due_dt = event_date
                phase = t.phase
                priority = t.priority
                notes = t.notes
            else:
                due_dt = nominal_dt
                phase = t.phase
                priority = t.priority
                notes = t.notes

        # Check if matching task was previously completed
        title_lower = t.title.strip().lower()
        is_completed = (
            title_lower in completed_set
            or any(ct in title_lower or title_lower in ct for ct in completed_set)
        )

        normalized.append(
            {
                "title": t.title,
                "phase": phase,
                "category": t.category,
                "dueDate": due_dt.strftime("%Y-%m-%d"),
                "dueDateTime": due_dt,
                "priority": priority,
                "completed": is_completed,
                "notes": notes,
                "isPostEvent": is_post_event,
            }
        )

    # Chronological sort: earliest due date first, post-event tasks last
    normalized.sort(
        key=lambda x: (
            x["dueDateTime"],
            1 if x["isPostEvent"] else 0,
        )
    )

    # Assign clean sequential IDs in chronological order
    final_tasks = []
    for i, item in enumerate(normalized):
        final_tasks.append(
            {
                "id": f"t-{i + 1}",
                "title": item["title"],
                "phase": item["phase"],
                "category": item["category"],
                "dueDate": item["dueDate"],
                "priority": item["priority"],
                "completed": item["completed"],
                "notes": item["notes"],
            }
        )

    return final_tasks


class GeminiService:
    @staticmethod
    def check_configuration():
        """Ensure API key is configured or raise descriptive error."""
        api_key = get_api_key()
        if not api_key:
            raise HTTPException(
                status_code=503,
                detail=(
                    "Google Gemini API key is not configured. "
                    "Please create backend/.env with your valid GEMINI_API_KEY from "
                    "Google AI Studio (https://aistudio.google.com/) to use live AI generation."
                ),
            )
        return api_key

    @staticmethod
    def generate_event_plan(request: EventPlanRequest) -> Dict[str, Any]:
        """
        Generate a complete, structured event plan using Google Gemini.
        Returns the exact JSON dictionary expected by Eventora AI frontend.
        """
        api_key = GeminiService.check_configuration()
        model_name = get_model_name()

        # Dynamic Server Date Context (Never hardcoded)
        today = datetime.now().date()
        today_str = today.strftime("%Y-%m-%d")

        try:
            event_dt = datetime.strptime(request.event_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid event date format. Use YYYY-MM-DD.",
            )

        days_until_event = (event_dt - today).days

        # Adaptive Timeline Guidance for Prompt
        if days_until_event <= 7:
            runway_note = (
                f"HIGH URGENCY: The celebration is only {max(0, days_until_event)} days away! "
                f"All pre-event tasks MUST have days_before_event between 0 and {max(0, days_until_event)}. "
                f"All pre-event deadlines MUST fall strictly between today ({today_str}) and {request.event_date}. "
                f"Use compressed phases: 'Immediate Priority (Day 1-2)', 'Pre-Event Preparation', 'Day Before Event', 'Day of Event', 'Post Event'."
            )
        elif days_until_event <= 30:
            runway_note = (
                f"SHORT RUNWAY: The celebration is {days_until_event} days away ({days_until_event // 7} weeks). "
                f"All pre-event tasks MUST have days_before_event between 0 and {days_until_event}. "
                f"All pre-event deadlines MUST fall strictly between today ({today_str}) and {request.event_date}. "
                f"Use phases: 'Immediate Priority (This Week)', '2-3 Weeks Before', '1-2 Weeks Before', 'Day of Event', 'Post Event'."
            )
        elif days_until_event <= 90:
            runway_note = (
                f"MEDIUM RUNWAY: The celebration is {days_until_event} days away. "
                f"All pre-event tasks MUST have days_before_event between 0 and {days_until_event}. "
                f"All pre-event deadlines MUST fall strictly between today ({today_str}) and {request.event_date}. "
                f"Traditional milestones (like venue or main caterer) are already high priority—schedule them within the next 3 to 7 days from today ({today_str}) with priority 'high'. "
                f"Use phases: 'Immediate Priority (This Week)', '1-2 Months Before', '1-2 Weeks Before', 'Day of Event', 'Post Event'."
            )
        else:
            runway_note = (
                f"RUNWAY: The celebration is {days_until_event} days away. "
                f"All pre-event tasks MUST have days_before_event between 0 and {days_until_event}. "
                f"All deadlines MUST fall on or after today ({today_str}) and on or before {request.event_date}. "
                f"Use phases: '3-6 Months Before', '1-2 Months Before', '1-2 Weeks Before', 'Day of Event', 'Post Event'."
            )

        client = genai.Client(api_key=api_key)

        prompt = f"""
You are an elite, highly experienced luxury event planner and master coordinator specializing in Indian celebrations and global milestone events for Eventora AI.

Event Specifications:
- Celebration Format: {request.event_type.upper()}
- Celebration Name: "{request.event_name}"
- Current Server Date (Today): {today_str}
- Event Date: {request.event_date} ({days_until_event} days from today)
- Location: {request.location}
- Total Budget in INR (₹): {int(request.total_budget):,}
- Expected Guests: {request.guest_count}
- Aesthetic Theme / Style: {request.theme_preferences or "Refined & Contemporary Celebration"}
- Special Requirements & Cultural Nuances: {request.special_requirements or "None specified"}

Critical Timeline Rules:
{runway_note}
- NEVER schedule a pre-event task before today ({today_str}). Every pre-event task must be actionable from today onward.
- Post Event tasks (vendor final settlements, return gifts/thank-yous, photo album delivery) should have negative days_before_event (e.g. -2 to -14 days), meaning 2 to 14 days AFTER the event date.

Your Core Deliverables:
1. OVERVIEW: Write an elegant, personalized editorial overview of this celebration plan, highlighting how it caters to the host city, guest count, and theme.
2. BUDGET ALLOCATIONS IN INR:
   - Provide 6 to 7 sensible categories (e.g. Venue & Hospitality, Catering & Banquets, Floral & Decor Styling, Photography & Cinematography, Music & Entertainment, Attire & Makeup, Contingency & Logistics).
   - Ensure the category percentages sum to exactly 100%.
   - Ensure the allocated_inr values sum to the total budget of {int(request.total_budget)}.
   - Provide practical rationales tailored to the region and format.
3. CHRONOLOGICAL MILESTONE TASKS:
   - Sequence 7 to 10 essential deliverables adapted to the actual remaining time ({days_until_event} days).
   - Assign realistic days_before_event values adhering strictly to the runway constraints above.
4. VENDOR CHECKLIST:
   - Provide 5 to 7 essential vendor discipline roles with descriptive titles (e.g., 'Heritage Banquet Catering Partner', 'Candid Cinematography Crew', 'Artisanal Floral Decorator').
   - DO NOT fabricate fake personal phone numbers or specific private companies. Keep them clearly labeled as partner specifications.
   - Allocate realistic estimated_cost_inr matching the budget categories.
5. CREATIVE CONCEPTS:
   - Provide 4 bespoke, tasteful ideas covering: 1 theme, 1 decor/styling, 1 food/culinary menu item, 1 entertainment/activity.
   - Provide evocative descriptions suitable for a luxury lifestyle magazine.

Generate high-quality, practical, culturally resonant results matching the requested JSON schema.
"""

        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=GeminiPlanOutputSchema,
                    temperature=0.7,
                ),
            )

            if not response.text:
                raise HTTPException(
                    status_code=502,
                    detail="Gemini API returned an empty response. Please try again.",
                )

            # Clean and validate with Pydantic
            cleaned_text = extract_clean_json(response.text)
            try:
                raw_data = GeminiPlanOutputSchema.model_validate_json(cleaned_text)
            except Exception as e:
                raise HTTPException(
                    status_code=502,
                    detail=f"Gemini API returned an invalid response format: {str(e)}",
                )

        except APIError as e:
            error_message = str(e)
            if "RESOURCE_EXHAUSTED" in error_message or "429" in error_message:
                raise HTTPException(
                    status_code=429,
                    detail="Gemini API quota exceeded or rate limit reached. Please wait a moment before trying again.",
                )
            elif "UNAUTHENTICATED" in error_message or "API_KEY_INVALID" in error_message:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid Gemini API key. Please check the GEMINI_API_KEY in backend/.env.",
                )
            elif "NOT_FOUND" in error_message:
                raise HTTPException(
                    status_code=404,
                    detail=f"The configured Gemini model '{model_name}' was not found or is unavailable for your API key. Check GEMINI_MODEL in backend/.env.",
                )
            else:
                raw_err = e.message if hasattr(e, 'message') else error_message
                code_label = e.code if hasattr(e, 'code') else 'Unknown'
                raise HTTPException(
                    status_code=502,
                    detail=f"Gemini API error ({code_label}): {sanitize_error_message(raw_err)}",
                )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to process AI event plan: {sanitize_error_message(str(e))}",
            )

        # -----------------------------------------------------------------
        # Map Gemini Output to Eventora AI Frontend Schema
        # -----------------------------------------------------------------
        now_ts = int(time.time() * 1000)
        event_id = f"gemini-event-{now_ts}"

        # Normalize budget allocations so total exactly matches request.total_budget
        budget_categories = []
        total_allocated = sum(c.allocated_inr for c in raw_data.budget_categories) or 1
        scale = request.total_budget / total_allocated

        for idx, cat in enumerate(raw_data.budget_categories):
            cat_id = f"cat-{idx + 1}"
            adjusted_amount = int(round(cat.allocated_inr * scale))
            budget_categories.append(
                {
                    "id": cat_id,
                    "name": cat.name,
                    "percentage": int(round((adjusted_amount / request.total_budget) * 100)),
                    "allocated": adjusted_amount,
                    "color": PALETTE_COLORS[idx % len(PALETTE_COLORS)],
                    "rationale": cat.rationale,
                }
            )

        # Guarantee category allocations sum EXACTLY to total budget
        diff = int(request.total_budget) - sum(c["allocated"] for c in budget_categories)
        if budget_categories and diff != 0:
            budget_categories[0]["allocated"] += diff

        # Guarantee percentages sum EXACTLY to 100%
        for c in budget_categories:
            c["percentage"] = max(1, int(round((c["allocated"] / request.total_budget) * 100)))
        p_diff = 100 - sum(c["percentage"] for c in budget_categories)
        if budget_categories and p_diff != 0:
            budget_categories[0]["percentage"] += p_diff

        # Timeline tasks validation, normalization, and chronological sorting
        timeline_tasks = normalize_timeline_tasks(
            raw_tasks=raw_data.timeline_tasks,
            today=today,
            event_date=event_dt,
            existing_completed_tasks=request.existing_completed_tasks,
        )

        # Vendors mapping with clear labeling as suggested service roles and estimates
        vendors = []
        for idx, v in enumerate(raw_data.vendor_checklist):
            vendors.append(
                {
                    "id": f"v-{idx + 1}",
                    "name": v.suggested_title,
                    "category": v.service_category,
                    "status": v.status,
                    "isSuggestedRole": True,
                    "contactPerson": "Quotes & RFPs Pending",
                    "phone": "Quotes pending inquiry",
                    "email": "quotes@eventora-partner.in",
                    "estimatedCost": v.estimated_cost_inr,
                    "depositPaid": 0,
                    "notes": f"Suggested partner specification: {v.key_deliverables}",
                }
            )

        # Creative ideas mapping
        ai_ideas = []
        for idx, idea in enumerate(raw_data.creative_ideas):
            ai_ideas.append(
                {
                    "id": f"idea-{idx + 1}",
                    "type": idea.type,
                    "title": idea.title,
                    "tag": idea.tag,
                    "description": idea.description,
                    "costImpact": idea.cost_impact,
                    "favorite": idx < 2,
                }
            )

        # Assemble full plan payload
        formatted_plan = {
            "id": event_id,
            "name": request.event_name,
            "type": request.event_type,
            "date": request.event_date,
            "location": request.location,
            "totalBudget": int(request.total_budget),
            "expectedGuests": request.guest_count,
            "theme": request.theme_preferences or "Modern Celebration",
            "specialRequirements": request.special_requirements or "None specified.",
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "isGeneratedByAI": True,
            "aiModelLabel": f"Google Gemini ({model_name})",
            "aiOverview": {
                "summary": raw_data.overview_summary,
                "theme_palette": raw_data.theme_palette,
                "key_recommendations": raw_data.key_recommendations,
            },
            "budgetCategories": budget_categories,
            "expenses": [],  # Clean start for actual expense logging
            "timelineTasks": timeline_tasks,
            "vendors": vendors,
            "aiIdeas": ai_ideas,
        }

        return formatted_plan

    @staticmethod
    def generate_creative_ideas(request: GenerateIdeasRequest) -> List[Dict[str, Any]]:
        """
        Synthesize fresh creative ideas for an existing active celebration.
        """
        api_key = GeminiService.check_configuration()
        model_name = get_model_name()

        client = genai.Client(api_key=api_key)

        prompt = f"""
You are an expert luxury celebration stylist and creative director for Eventora AI.
Generate 4 fresh, imaginative, tasteful celebration concepts for:
- Celebration: "{request.event_name}" ({request.event_type})
- Theme: {request.theme or "Refined & Contemporary Celebration"}
- Location: {request.location}
- Guests: {request.guest_count}
- Budget: ₹{int(request.total_budget):,}

Requirements:
- If category is specified and not 'all', focus on that category ({request.category}). Otherwise provide a diverse mix (theme, decor, food, entertainment).
- Concepts must feel like high-end editorial lifestyle ideas (artisanal live stations, thoughtful lighting, immersive guest activities, refined color stories).
- Format strictly as JSON according to the schema.
"""

        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=GeminiIdeasOutputSchema,
                    temperature=0.8,
                ),
            )

            if not response.text:
                raise HTTPException(
                    status_code=502,
                    detail="Gemini API returned an empty response.",
                )

            cleaned_text = extract_clean_json(response.text)
            try:
                raw_data = GeminiIdeasOutputSchema.model_validate_json(cleaned_text)
            except Exception as e:
                raise HTTPException(
                    status_code=502,
                    detail=f"Gemini API returned an invalid ideas response format: {str(e)}",
                )

            now_ts = int(time.time() * 1000)
            formatted_ideas = []
            for idx, idea in enumerate(raw_data.ideas):
                formatted_ideas.append(
                    {
                        "id": f"ai-idea-{now_ts}-{idx + 1}",
                        "type": idea.type,
                        "title": idea.title,
                        "tag": idea.tag,
                        "description": idea.description,
                        "costImpact": idea.cost_impact,
                        "favorite": True,
                    }
                )

            return formatted_ideas

        except APIError as e:
            error_message = str(e)
            if "RESOURCE_EXHAUSTED" in error_message or "429" in error_message:
                raise HTTPException(
                    status_code=429,
                    detail="Gemini API quota exceeded. Please wait a moment before synthesizing more concepts.",
                )
            elif "UNAUTHENTICATED" in error_message or "API_KEY_INVALID" in error_message:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid Gemini API key configured in backend/.env.",
                )
            else:
                raise HTTPException(
                    status_code=502,
                    detail=f"Gemini API error: {sanitize_error_message(error_message)}",
                )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate ideas: {sanitize_error_message(str(e))}",
            )
