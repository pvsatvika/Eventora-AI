import pytest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException
from models.schemas import EventPlanRequest, GenerateIdeasRequest
from services.gemini_service import (
    get_api_key,
    get_model_name,
    is_gemini_configured,
    GeminiService,
)


def test_get_api_key_valid():
    """Returns valid key when non-placeholder string is provided."""
    with patch("os.getenv", return_value="AIzaSyValidKey12345"):
        assert get_api_key() == "AIzaSyValidKey12345"


def test_get_api_key_detects_placeholders():
    """Returns None when placeholder values are present."""
    placeholders = [
        "YOUR_API_KEY_HERE",
        "YOUR_ACTUAL_GEMINI_API_KEY",
        "PLACEHOLDER",
        "YOUR_GEMINI_API_KEY",
        "CHANGE_ME",
        "",
        "   ",
    ]
    for ph in placeholders:
        with patch("os.getenv", return_value=ph):
            assert get_api_key() is None


def test_get_model_name_default():
    """Defaults to gemini-2.5-flash when GEMINI_MODEL is empty."""
    with patch("os.getenv", return_value=""):
        assert get_model_name() == "gemini-2.5-flash"

    with patch("os.getenv", return_value="gemini-2.0-flash"):
        assert get_model_name() == "gemini-2.0-flash"


def test_gemini_service_raises_503_when_unconfigured():
    """Calling generate_event_plan or generate_creative_ideas raises 503 if Gemini is not configured."""
    req_plan = EventPlanRequest(
        event_type="wedding",
        event_name="Celebration",
        event_date="2027-04-15",
        location="Jaipur",
        total_budget=1000000,
        guest_count=150,
    )

    with patch("services.gemini_service.get_api_key", return_value=None):
        with pytest.raises(HTTPException) as exc_info:
            GeminiService.generate_event_plan(req_plan)
        assert exc_info.value.status_code == 503
        assert "not configured" in exc_info.value.detail

    req_ideas = GenerateIdeasRequest(
        event_name="Celebration",
        event_type="wedding",
    )
    with patch("services.gemini_service.get_api_key", return_value=None):
        with pytest.raises(HTTPException) as exc_info:
            GeminiService.generate_creative_ideas(req_ideas)
        assert exc_info.value.status_code == 503


def test_gemini_service_generate_plan_mocked(mock_gemini_plan_data):
    """GeminiService parses structured output and returns valid celebration blueprint."""
    req_plan = EventPlanRequest(
        event_type="wedding",
        event_name="Ananya & Kabir's Wedding",
        event_date="2027-04-15",
        location="Jaipur",
        total_budget=1800000,
        guest_count=200,
    )

    import json
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.text = json.dumps(mock_gemini_plan_data)
    mock_client.models.generate_content.return_value = mock_response

    with patch("services.gemini_service.get_api_key", return_value="AIzaSyMockKey"), \
         patch("services.gemini_service.genai.Client", return_value=mock_client):
        plan = GeminiService.generate_event_plan(req_plan)

        assert "aiOverview" in plan
        assert "summary" in plan["aiOverview"]
        assert len(plan["budgetCategories"]) == 5
        assert len(plan["timelineTasks"]) == 5
        assert len(plan["vendors"]) == 2
        assert len(plan["aiIdeas"]) == 2
        # Check that allocated amounts sum to total budget (1800000)
        total_allocated = sum(c["allocated"] for c in plan["budgetCategories"])
        assert total_allocated == 1800000


def test_gemini_service_generate_ideas_mocked():
    """GeminiService generates creative ideas using structured schema."""
    import json
    req_ideas = GenerateIdeasRequest(
        event_name="Aarav's 30th",
        event_type="birthday",
        theme="Speakeasy Jazz",
    )

    sample_ideas = {
        "ideas": [
            {
                "type": "entertainment",
                "title": "Acoustic Trio",
                "tag": "Entertainment & Music",
                "description": "Live jazz trio playing smooth classics.",
                "cost_impact": "Moderate"
            }
        ]
    }

    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.text = json.dumps(sample_ideas)
    mock_client.models.generate_content.return_value = mock_response

    with patch("services.gemini_service.get_api_key", return_value="AIzaSyMockKey"), \
         patch("services.gemini_service.genai.Client", return_value=mock_client):
        ideas = GeminiService.generate_creative_ideas(req_ideas)
        assert len(ideas) == 1
        assert ideas[0]["title"] == "Acoustic Trio"
