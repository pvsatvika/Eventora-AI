import pytest
from pydantic import ValidationError
from models.schemas import (
    EventPlanRequest,
    GenerateIdeasRequest,
    HealthResponse,
    BudgetCategoryGemini,
    TimelineTaskGemini,
    VendorChecklistGemini,
    CreativeIdeaGemini,
)


def test_valid_event_plan_request():
    """EventPlanRequest instantiates cleanly with valid parameters."""
    req = EventPlanRequest(
        event_type="wedding",
        event_name="Rohit & Priya's Sangeet",
        event_date="2027-02-14",
        location="Udaipur",
        total_budget=1500000,
        guest_count=200,
        theme_preferences="Royal Palace Pastel",
        special_requirements="Vegetarian feast",
    )
    assert req.event_type == "wedding"
    assert req.total_budget == 1500000.0
    assert req.guest_count == 200
    assert req.event_date == "2027-02-14"


def test_invalid_event_type_rejected():
    """Invalid event_type not in Literal['wedding', 'birthday', 'community'] raises ValidationError."""
    with pytest.raises(ValidationError):
        EventPlanRequest(
            event_type="concert",
            event_name="Music Festival",
            event_date="2027-02-14",
            location="Mumbai",
            total_budget=500000,
            guest_count=100,
        )


def test_invalid_date_format_rejected():
    """Dates not adhering to YYYY-MM-DD pattern fail validation."""
    invalid_dates = ["14-02-2027", "2027/02/14", "Feb 14 2027", "not-a-date"]
    for bad_date in invalid_dates:
        with pytest.raises(ValidationError):
            EventPlanRequest(
                event_type="wedding",
                event_name="Celebration",
                event_date=bad_date,
                location="Delhi",
                total_budget=100000,
                guest_count=50,
            )


def test_date_validator_strips_whitespace():
    """Valid YYYY-MM-DD date with surrounding whitespace is stripped cleanly."""
    req = EventPlanRequest(
        event_type="birthday",
        event_name="30th Birthday",
        event_date="  2027-05-20  ",
        location="Bengaluru",
        total_budget=100000,
        guest_count=30,
    )
    assert req.event_date == "2027-05-20"


def test_budget_boundary_validation():
    """Budgets under 5,000 INR or over 500,000,000 INR raise ValidationError."""
    with pytest.raises(ValidationError):
        EventPlanRequest(
            event_type="birthday",
            event_name="Party",
            event_date="2027-05-20",
            location="Bengaluru",
            total_budget=4999,  # below minimum 5,000
            guest_count=20,
        )

    with pytest.raises(ValidationError):
        EventPlanRequest(
            event_type="wedding",
            event_name="Royal Wedding",
            event_date="2027-05-20",
            location="Jaipur",
            total_budget=500000001,  # above maximum 500,000,000
            guest_count=500,
        )


def test_guest_count_boundary_validation():
    """Guest count must be between 1 and 10,000."""
    with pytest.raises(ValidationError):
        EventPlanRequest(
            event_type="community",
            event_name="Town Festival",
            event_date="2027-05-20",
            location="Pune",
            total_budget=50000,
            guest_count=0,
        )

    with pytest.raises(ValidationError):
        EventPlanRequest(
            event_type="community",
            event_name="Town Festival",
            event_date="2027-05-20",
            location="Pune",
            total_budget=50000,
            guest_count=10001,
        )


def test_generate_ideas_request():
    """GenerateIdeasRequest handles optional defaults gracefully."""
    req = GenerateIdeasRequest(
        event_name="Kavya's 25th",
        event_type="birthday",
    )
    assert req.guest_count == 100
    assert req.total_budget == 500000
    assert req.location == "India"
    assert req.category == "all"


def test_gemini_component_schemas():
    """Sub-schemas for Gemini structured output validate successfully."""
    cat = BudgetCategoryGemini(
        name="Venue & Hospitality",
        percentage=35,
        allocated_inr=350000,
        rationale="Lawn rental and room blocks.",
    )
    assert cat.percentage == 35

    task = TimelineTaskGemini(
        title="Book Floral Decorator",
        phase="1-2 Months Before",
        category="Decor",
        days_before_event=45,
        priority="high",
        notes="Pick pastel roses.",
    )
    assert task.days_before_event == 45

    vendor = VendorChecklistGemini(
        service_category="Floral & Styling",
        suggested_title="Artisanal Florist",
        status="Contacted",
        estimated_cost_inr=150000,
        key_deliverables="Mandap backdrop and entrance arches.",
    )
    assert vendor.status == "Contacted"

    idea = CreativeIdeaGemini(
        type="decor",
        title="Terracotta Diya Wall",
        tag="Decor & Styling",
        description="Handcrafted earthen lamps lining the garden pathway.",
        cost_impact="Budget-friendly",
    )
    assert idea.type == "decor"


def test_invalid_calendar_dates_rejected():
    """Valid regex but nonexistent calendar dates are rejected."""
    bad_calendar_dates = [
        "2027-02-31",  # February never has 31 days
        "2027-04-31",  # April only has 30 days
        "2027-02-29",  # 2027 is not a leap year
        "2027-13-01",  # Month 13 does not exist
        "2027-00-10",  # Month 0 does not exist
        "2027-05-32",  # Day 32 does not exist
    ]
    for bad_date in bad_calendar_dates:
        with pytest.raises(ValidationError):
            EventPlanRequest(
                event_type="wedding",
                event_name="Celebration",
                event_date=bad_date,
                location="Bengaluru",
                total_budget=1000000,
                guest_count=100,
            )


def test_valid_leap_year_accepted():
    """Leap year date (2028-02-29) is accepted cleanly."""
    req = EventPlanRequest(
        event_type="wedding",
        event_name="Leap Year Celebration",
        event_date="2028-02-29",
        location="Bengaluru",
        total_budget=1000000,
        guest_count=100,
    )
    assert req.event_date == "2028-02-29"


def test_year_range_validation():
    """Dates with year outside 2024-2099 are rejected."""
    for out_of_range in ["2020-01-01", "2105-05-15"]:
        with pytest.raises(ValidationError):
            EventPlanRequest(
                event_type="wedding",
                event_name="Celebration",
                event_date=out_of_range,
                location="Bengaluru",
                total_budget=1000000,
                guest_count=100,
            )


def test_generate_ideas_request_bounds():
    """GenerateIdeasRequest validates numeric bounds and field lengths."""
    # Negative guest count
    with pytest.raises(ValidationError):
        GenerateIdeasRequest(
            event_name="Birthday Party",
            event_type="birthday",
            guest_count=0,
        )

    # Budget below minimum
    with pytest.raises(ValidationError):
        GenerateIdeasRequest(
            event_name="Birthday Party",
            event_type="birthday",
            total_budget=100,
        )

