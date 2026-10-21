from unittest.mock import patch, MagicMock


def test_post_generate_plan_valid(client, mock_gemini_plan_data):
    """POST /api/generate-plan returns 200 with structured plan when Gemini is mocked."""
    payload = {
        "event_type": "wedding",
        "event_name": "Meera & Siddharth's Wedding",
        "event_date": "2027-03-25",
        "location": "Jaipur, Rajasthan",
        "total_budget": 1500000,
        "guest_count": 180,
        "theme_preferences": "Royal Heritage Rajputana",
        "special_requirements": "Vegetarian cuisine",
    }

    import json
    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.text = json.dumps(mock_gemini_plan_data)
    mock_client.models.generate_content.return_value = mock_resp

    with patch("services.gemini_service.get_api_key", return_value="AIzaSyMockKey"), \
         patch("services.gemini_service.genai.Client", return_value=mock_client):
        response = client.post("/api/generate-plan", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "aiOverview" in data
        assert "summary" in data["aiOverview"]
        assert "budgetCategories" in data
        assert "timelineTasks" in data
        assert "vendors" in data
        assert "aiIdeas" in data


def test_post_generate_plan_invalid_input(client):
    """POST /api/generate-plan returns 422 when required fields are missing or invalid."""
    # Missing required 'event_type' and 'event_name'
    response = client.post("/api/generate-plan", json={"total_budget": 100000})
    assert response.status_code == 422

    # Invalid budget (less than 5,000)
    invalid_budget_payload = {
        "event_type": "birthday",
        "event_name": "Birthday Party",
        "event_date": "2027-01-01",
        "location": "Delhi",
        "total_budget": 500,  # below 5000
        "guest_count": 10,
    }
    response = client.post("/api/generate-plan", json=invalid_budget_payload)
    assert response.status_code == 422


def test_post_generate_plan_unconfigured_gemini(client):
    """POST /api/generate-plan returns 503 if Gemini API key is missing/unconfigured."""
    payload = {
        "event_type": "birthday",
        "event_name": "30th Birthday",
        "event_date": "2027-05-10",
        "location": "Goa",
        "total_budget": 200000,
        "guest_count": 40,
    }
    with patch("services.gemini_service.get_api_key", return_value=None):
        response = client.post("/api/generate-plan", json=payload)
        assert response.status_code == 503
        data = response.json()
        assert "detail" in data
        assert "not configured" in data["detail"]


def test_post_generate_ideas_valid(client):
    """POST /api/generate-ideas returns 200 with ideas list."""
    payload = {
        "event_name": "Spring Community Mela",
        "event_type": "community",
        "theme": "Eco-friendly Artisan",
        "guest_count": 300,
        "total_budget": 300000,
        "location": "Bengaluru",
        "category": "decor",
    }

    import json
    mock_ideas = {
        "ideas": [
            {
                "type": "decor",
                "title": "Recycled Paper Lantern Canopy",
                "tag": "Decor & Styling",
                "description": "Handmade paper lanterns hanging under banyan branches.",
                "cost_impact": "Budget-friendly"
            }
        ]
    }

    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.text = json.dumps(mock_ideas)
    mock_client.models.generate_content.return_value = mock_resp

    with patch("services.gemini_service.get_api_key", return_value="AIzaSyMockKey"), \
         patch("services.gemini_service.genai.Client", return_value=mock_client):
        response = client.post("/api/generate-ideas", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "ideas" in data
        assert len(data["ideas"]) == 1


def test_cors_headers_present(client):
    """OPTIONS request to API endpoints returns proper CORS headers."""
    response = client.options(
        "/api/health",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers
