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
    with patch("os.getenv", return_value="valid_synthetic_api_key_12345"):
        assert get_api_key() == "valid_synthetic_api_key_12345"


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

    with patch("services.gemini_service.get_api_key", return_value="mock_synthetic_api_key"), \
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

    with patch("services.gemini_service.get_api_key", return_value="mock_synthetic_api_key"), \
         patch("services.gemini_service.genai.Client", return_value=mock_client):
        ideas = GeminiService.generate_creative_ideas(req_ideas)
        assert len(ideas) == 1
        assert ideas[0]["title"] == "Acoustic Trio"


def test_extract_clean_json_markdown_fences():
    """extract_clean_json strips markdown code blocks and whitespace."""
    from services.gemini_service import extract_clean_json

    assert extract_clean_json("") == ""
    assert extract_clean_json("   ") == ""

    raw_markdown = "```json\n{\"key\": \"value\"}\n```"
    assert extract_clean_json(raw_markdown) == "{\"key\": \"value\"}"

    raw_generic_fence = "```\n{\"key\": \"value\"}\n```"
    assert extract_clean_json(raw_generic_fence) == "{\"key\": \"value\"}"

    raw_plain = "  {\"key\": \"value\"}  "
    assert extract_clean_json(raw_plain) == "{\"key\": \"value\"}"


def test_gemini_service_empty_text_raises_502():
    """Empty or None response from Gemini generates a 502 Bad Gateway HTTPException."""
    req_plan = EventPlanRequest(
        event_type="wedding",
        event_name="Celebration",
        event_date="2027-04-15",
        location="Jaipur",
        total_budget=1800000,
        guest_count=200,
    )
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.text = ""
    mock_client.models.generate_content.return_value = mock_response

    with patch("services.gemini_service.get_api_key", return_value="mock_synthetic_api_key"), \
         patch("services.gemini_service.genai.Client", return_value=mock_client):
        with pytest.raises(HTTPException) as exc_info:
            GeminiService.generate_event_plan(req_plan)
        assert exc_info.value.status_code == 502
        assert "empty response" in exc_info.value.detail


def test_gemini_service_malformed_json_raises_502():
    """Malformed non-JSON output from Gemini generates a 502 Bad Gateway HTTPException."""
    req_plan = EventPlanRequest(
        event_type="wedding",
        event_name="Celebration",
        event_date="2027-04-15",
        location="Jaipur",
        total_budget=1800000,
        guest_count=200,
    )
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "This is not valid JSON at all!"
    mock_client.models.generate_content.return_value = mock_response

    with patch("services.gemini_service.get_api_key", return_value="mock_synthetic_api_key"), \
         patch("services.gemini_service.genai.Client", return_value=mock_client):
        with pytest.raises(HTTPException) as exc_info:
            GeminiService.generate_event_plan(req_plan)
        assert exc_info.value.status_code == 502
        assert "invalid response format" in exc_info.value.detail


def test_gemini_service_api_error_subtypes():
    """Gemini APIError maps to appropriate status codes (401, 404, 429)."""
    from google.genai.errors import APIError

    req_plan = EventPlanRequest(
        event_type="wedding",
        event_name="Celebration",
        event_date="2027-04-15",
        location="Jaipur",
        total_budget=1800000,
        guest_count=200,
    )

    error_cases = [
        ("429 RESOURCE_EXHAUSTED: quota exceeded", 429),
        ("UNAUTHENTICATED: API_KEY_INVALID", 401),
        ("NOT_FOUND: models/gemini-2.5-flash not found", 404),
    ]

    for err_msg, expected_status in error_cases:
        mock_client = MagicMock()
        mock_client.models.generate_content.side_effect = APIError(
            code=expected_status,
            response_json={"error": {"message": err_msg, "code": expected_status}},
        )

        with patch("services.gemini_service.get_api_key", return_value="mock_synthetic_api_key"), \
             patch("services.gemini_service.genai.Client", return_value=mock_client):
            with pytest.raises(HTTPException) as exc_info:
                GeminiService.generate_event_plan(req_plan)
            assert exc_info.value.status_code == expected_status


def test_sanitize_error_message_redacts_secrets():
    """sanitize_error_message redacts Google API keys and sensitive query parameters."""
    from services.gemini_service import sanitize_error_message

    # 1. Query-parameter credential redaction (e.g. ?key=... or &key=...)
    query_err = "Request failed for URL https://generativelanguage.googleapis.com/v1beta/models?key=synthetic_secret_token_12345&alt=json"
    sanitized_query = sanitize_error_message(query_err)
    assert "synthetic_secret_token_12345" not in sanitized_query
    assert "key=[REDACTED]" in sanitized_query

    # 2. Google API key shape redaction (verifies the regex without committing a static key token)
    # Dynamically compose a synthetic token matching the 39-character AIza shape (AIza + 35 characters)
    synthetic_google_key = "AIza" + ("test_synthetic_token_payload_padding"[:35])
    assert len(synthetic_google_key) == 39
    header_err = f"API error with token {synthetic_google_key} in error response"
    sanitized_header = sanitize_error_message(header_err)
    assert synthetic_google_key not in sanitized_header
    assert "[REDACTED_API_KEY]" in sanitized_header

    # 3. Empty and None string handling
    assert sanitize_error_message("") == "An unknown error occurred."
    assert sanitize_error_message(None) == "An unknown error occurred."



