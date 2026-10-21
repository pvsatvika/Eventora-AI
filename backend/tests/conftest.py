import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Ensure backend root is on Python module search path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from main import app


@pytest.fixture
def client():
    """FastAPI TestClient fixture."""
    return TestClient(app)


@pytest.fixture
def mock_gemini_plan_data():
    """Sample structured Gemini plan output data."""
    return {
        "overview_summary": "A magnificent royal Rajasthani celebration blending classic heritage with modern pastel touches.",
        "theme_palette": ["Royal Emerald", "Twilight Gold", "Blush Rose", "Ivory Cream"],
        "key_recommendations": [
            "Secure heritage venue courtyard 6 months in advance.",
            "Schedule Sangeet rehearsal evening before main ceremony.",
            "Coordinate artisanal welcome drink stalls for arriving guests."
        ],
        "budget_categories": [
            {
                "name": "Venue & Banquets",
                "percentage": 40,
                "allocated_inr": 720000,
                "rationale": "Palace lawn and banquet hall booking."
            },
            {
                "name": "Catering & Dining",
                "percentage": 30,
                "allocated_inr": 540000,
                "rationale": "Multi-cuisine live counters and royal feast."
            },
            {
                "name": "Decor & Floral",
                "percentage": 15,
                "allocated_inr": 270000,
                "rationale": "Marigold cascades, fairy lights, and brass lamps."
            },
            {
                "name": "Photography & Film",
                "percentage": 10,
                "allocated_inr": 180000,
                "rationale": "Candid cinematographer and traditional team."
            },
            {
                "name": "Contingency Fund",
                "percentage": 5,
                "allocated_inr": 90000,
                "rationale": "Buffer for last-minute adjustments."
            }
        ],
        "timeline_tasks": [
            {
                "title": "Finalize Venue Contract",
                "phase": "3-6 Months Before",
                "category": "Venue",
                "days_before_event": 90,
                "priority": "high",
                "notes": "Verify curfew timings and sound permissions."
            },
            {
                "title": "Select Catering Menu Tasting",
                "phase": "1-2 Months Before",
                "category": "Catering",
                "days_before_event": 45,
                "priority": "medium",
                "notes": "Confirm vegetarian counter selections."
            },
            {
                "title": "Final Floor Plan & Seating",
                "phase": "1-2 Weeks Before",
                "category": "Logistics",
                "days_before_event": 10,
                "priority": "medium",
                "notes": "Review stage alignment."
            },
            {
                "title": "Event Day Coordination",
                "phase": "Day of Event",
                "category": "Coordination",
                "days_before_event": 0,
                "priority": "high",
                "notes": "Welcome guests and coordinate vendor entries."
            },
            {
                "title": "Vendor Settlements & Album Delivery",
                "phase": "Post Event",
                "category": "Settlement",
                "days_before_event": -7,
                "priority": "low",
                "notes": "Clear pending balances."
            }
        ],
        "vendor_checklist": [
            {
                "service_category": "Venue & Hospitality",
                "suggested_title": "Heritage Palace Lawn Partner",
                "status": "Researching",
                "estimated_cost_inr": 720000,
                "key_deliverables": "Main lawn, banquet hall, and bridal dressing suites."
            },
            {
                "service_category": "Catering",
                "suggested_title": "Royal Banquet Caterer",
                "status": "Not Started",
                "estimated_cost_inr": 540000,
                "key_deliverables": "3-course dinner with live chaat and dessert counters."
            }
        ],
        "creative_ideas": [
            {
                "type": "decor",
                "title": "Marigold & Brass Lamp Entryway",
                "tag": "Decor & Styling",
                "description": "Fragrant marigold torans and traditional urli bowls with floating candles.",
                "cost_impact": "Moderate"
            },
            {
                "type": "food",
                "title": "Heritage Mithai Station",
                "tag": "Food & Menu",
                "description": "Live jalebi and rabdi station served in terracotta kulhads.",
                "cost_impact": "Budget-friendly"
            }
        ]
    }
