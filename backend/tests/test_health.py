import pytest
from unittest.mock import patch


def test_health_check_returns_200(client):
    """GET /api/health returns 200 with required schema fields."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "gemini_configured" in data
    assert isinstance(data["gemini_configured"], bool)
    assert "model" in data
    assert data["version"] == "1.0.0"


def test_health_check_configured_state(client):
    """GET /api/health accurately reports True when Gemini key is configured."""
    with patch("main.is_gemini_configured", return_value=True):
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["gemini_configured"] is True


def test_health_check_unconfigured_state(client):
    """GET /api/health accurately reports False when Gemini key is missing or placeholder."""
    with patch("main.is_gemini_configured", return_value=False):
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["gemini_configured"] is False
