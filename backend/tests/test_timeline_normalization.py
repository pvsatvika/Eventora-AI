from datetime import date, timedelta
from models.schemas import TimelineTaskGemini
from services.gemini_service import normalize_timeline_tasks


def test_normalize_normal_future_tasks():
    """Future tasks are scheduled relative to event date and sorted chronologically."""
    today = date(2026, 10, 20)
    event_date = date(2027, 4, 20)  # 6 months in future

    raw = [
        TimelineTaskGemini(
            title="Book Venue",
            phase="3-6 Months Before",
            category="Venue",
            days_before_event=120,
            priority="high",
            notes="Sign contract",
        ),
        TimelineTaskGemini(
            title="Order Invitations",
            phase="1-2 Months Before",
            category="Stationery",
            days_before_event=45,
            priority="medium",
            notes="Digital & print",
        ),
        TimelineTaskGemini(
            title="Day of Coordination",
            phase="Day of Event",
            category="Coordination",
            days_before_event=0,
            priority="high",
            notes="Lead coordinator",
        ),
    ]

    normalized = normalize_timeline_tasks(raw, today, event_date)
    assert len(normalized) == 3

    # Chronologically earliest first
    assert normalized[0]["title"] == "Book Venue"
    assert normalized[0]["dueDate"] == "2026-12-21"
    assert normalized[1]["title"] == "Order Invitations"
    assert normalized[1]["dueDate"] == "2027-03-06"
    assert normalized[2]["title"] == "Day of Coordination"
    assert normalized[2]["dueDate"] == "2027-04-20"


def test_normalize_reschedules_past_milestones():
    """Milestones that would fall in the past relative to server date are rescheduled to upcoming actionable dates."""
    today = date(2026, 10, 20)
    # Event is 3 weeks away
    event_date = date(2026, 11, 10)

    # A 6-month task (days_before_event=180) would fall on 2026-05-14 (in the past!)
    raw = [
        TimelineTaskGemini(
            title="Book Wedding Venue",
            phase="6 Months Before",
            category="Venue",
            days_before_event=180,
            priority="medium",
            notes="Select venue location",
        ),
    ]

    normalized = normalize_timeline_tasks(raw, today, event_date)
    assert len(normalized) == 1
    task = normalized[0]

    # Deadline must NOT be in the past
    task_dt = date.fromisoformat(task["dueDate"])
    assert task_dt >= today
    assert task_dt <= event_date
    assert task["priority"] == "high"
    assert "Urgent: Rescheduled" in task["notes"]


def test_normalize_post_event_tasks():
    """Post-event deliverables are scheduled after the event date."""
    today = date(2026, 10, 20)
    event_date = date(2026, 11, 20)

    raw = [
        TimelineTaskGemini(
            title="Vendor Balances Clearance",
            phase="Post Event",
            category="Finance",
            days_before_event=-7,  # 7 days after event
            priority="low",
            notes="Verify final invoices",
        ),
    ]

    normalized = normalize_timeline_tasks(raw, today, event_date)
    assert len(normalized) == 1
    task = normalized[0]
    task_dt = date.fromisoformat(task["dueDate"])
    assert task_dt > event_date
    assert task["phase"] == "Post Event"


def test_normalize_preserves_completed_tasks():
    """Previously completed tasks maintain completed=True state."""
    today = date(2026, 10, 20)
    event_date = date(2027, 2, 20)

    raw = [
        TimelineTaskGemini(
            title="Finalize Engagement Rings",
            phase="3-6 Months Before",
            category="Attire",
            days_before_event=90,
            priority="medium",
            notes="Pick rings",
        ),
        TimelineTaskGemini(
            title="Book Makeup Artist",
            phase="1-2 Months Before",
            category="Beauty",
            days_before_event=30,
            priority="high",
            notes="Trial done",
        ),
    ]

    existing_completed = ["Finalize Engagement Rings"]
    normalized = normalize_timeline_tasks(raw, today, event_date, existing_completed)

    assert normalized[0]["title"] == "Finalize Engagement Rings"
    assert normalized[0]["completed"] is True
    assert normalized[1]["title"] == "Book Makeup Artist"
    assert normalized[1]["completed"] is False
