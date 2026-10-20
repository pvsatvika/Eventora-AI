from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Literal
from datetime import date as dt_date
import re


# -------------------------------------------------------------------------
# Request Schemas
# -------------------------------------------------------------------------

class EventPlanRequest(BaseModel):
    event_type: Literal["wedding", "birthday", "community"] = Field(
        ..., description="Type of event: wedding, birthday, or community"
    )
    event_name: str = Field(..., min_length=2, max_length=120, description="Name or title of celebration")
    event_date: str = Field(..., description="Target date of the event in YYYY-MM-DD format")
    location: str = Field(..., min_length=2, max_length=120, description="City, region, or venue name")
    total_budget: float = Field(..., ge=5000, le=500000000, description="Total budget in Indian Rupees (INR)")
    guest_count: int = Field(..., ge=1, le=10000, description="Expected number of attendees")
    theme_preferences: Optional[str] = Field(None, max_length=250, description="Aesthetic style, colors, or vibe")
    special_requirements: Optional[str] = Field(None, max_length=1000, description="Dietary, ritual, or accessibility notes")
    existing_completed_tasks: Optional[List[str]] = Field(
        default=None,
        description="Titles of previously completed tasks to preserve completion status across plan regenerations",
    )

    @field_validator("event_date")
    @classmethod
    def validate_date(cls, v: str) -> str:
        # Check basic YYYY-MM-DD structure
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", v.strip()):
            raise ValueError("Event date must follow the YYYY-MM-DD format.")
        return v.strip()


class GenerateIdeasRequest(BaseModel):
    event_name: str = Field(..., description="Name of the celebration")
    event_type: str = Field(..., description="Type of event (wedding, birthday, community)")
    theme: Optional[str] = Field(None, description="Current theme or aesthetic vision")
    guest_count: Optional[int] = Field(100, description="Guest count")
    total_budget: Optional[float] = Field(500000, description="Budget in INR")
    location: Optional[str] = Field("India", description="City or venue location")
    category: Optional[str] = Field("all", description="Specific category filter (all, theme, decor, food, entertainment)")


# -------------------------------------------------------------------------
# Gemini Structured Output Schemas (Pydantic models for response_schema)
# -------------------------------------------------------------------------

class BudgetCategoryGemini(BaseModel):
    name: str = Field(..., description="Category name (e.g., Venue & Stay, Catering & Food, Floral & Decor, Photography, Music & Sound, Attire, Contingency)")
    percentage: int = Field(..., ge=1, le=80, description="Percentage of total budget allocated")
    allocated_inr: int = Field(..., description="Absolute allocated amount in INR")
    rationale: str = Field(..., description="Brief practical explanation of why this amount is suggested")


class TimelineTaskGemini(BaseModel):
    title: str = Field(..., description="Actionable deliverable title")
    phase: str = Field(
        ...,
        description="Milestone phase adapted to remaining time, e.g., 'Immediate Priority (This Week)', '1-2 Months Before', '1-2 Weeks Before', 'Day of Event', 'Post Event'",
    )
    category: str = Field(..., description="Domain category such as Venue, Catering, Decor, Invitations, Logistics")
    days_before_event: int = Field(
        ...,
        description="Days relative to event. Positive number (e.g. 60, 30, 7) means days before event; 0 means day of event; negative number (e.g. -3, -7) means days after event for post-event tasks",
    )
    priority: Literal["high", "medium", "low"] = Field(..., description="Priority level")
    notes: str = Field(..., description="Guidance or checklist items")


class VendorChecklistGemini(BaseModel):
    service_category: str = Field(..., description="Vendor category (e.g., Venue & Hospitality, Catering & Banquets, Photography, Decor & Floral, Music & Entertainment, Hair & Makeup)")
    suggested_title: str = Field(..., description="Descriptive vendor role label (e.g., 'Heritage Palace Banquet Partner', 'Candid Cinematographer', 'Artisanal Decor Stylist')")
    status: Literal["Not Started", "Researching", "Contacted", "Deposit Paid", "Booked"] = Field(
        default="Researching", description="Initial booking status"
    )
    estimated_cost_inr: int = Field(..., description="Estimated cost allocation in INR")
    key_deliverables: str = Field(..., description="Contract highlights or items to clarify during quotes")


class CreativeIdeaGemini(BaseModel):
    type: Literal["theme", "decor", "food", "entertainment"] = Field(
        ..., description="Idea category: theme, decor, food, or entertainment"
    )
    title: str = Field(..., description="Creative, evocative title")
    tag: str = Field(..., description="Sub-tag (e.g., Theme & Aesthetic, Decor & Styling, Food & Menu, Entertainment & Fun)")
    description: str = Field(..., description="Detailed, tasteful lifestyle description of the concept")
    cost_impact: Literal["Budget-friendly", "Moderate", "Premium"] = Field(
        ..., description="Cost impact tier"
    )


class GeminiPlanOutputSchema(BaseModel):
    overview_summary: str = Field(..., description="Personalized editorial summary of this celebration plan")
    theme_palette: List[str] = Field(..., description="3 to 4 complementary color names or aesthetic motifs")
    key_recommendations: List[str] = Field(..., description="3 to 4 practical tips tailored to the location, budget, guest count, and culture")
    budget_categories: List[BudgetCategoryGemini] = Field(..., description="List of budget categories totaling 100% of the budget")
    timeline_tasks: List[TimelineTaskGemini] = Field(..., description="Chronological deliverables sequenced across phases")
    vendor_checklist: List[VendorChecklistGemini] = Field(..., description="Checklist of essential vendor roles")
    creative_ideas: List[CreativeIdeaGemini] = Field(..., description="Tailored themes, decoration, culinary, and entertainment concepts")


class GeminiIdeasOutputSchema(BaseModel):
    ideas: List[CreativeIdeaGemini] = Field(..., description="List of 4 to 6 fresh creative concepts")


# -------------------------------------------------------------------------
# Health Response
# -------------------------------------------------------------------------

class HealthResponse(BaseModel):
    status: str
    gemini_configured: bool
    model: str
    version: str = "1.0.0"
