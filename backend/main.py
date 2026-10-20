import os
from pathlib import Path
from typing import List, Dict, Any
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Load environment using absolute path derived from pathlib.Path(__file__)
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

from models.schemas import (
    EventPlanRequest,
    GenerateIdeasRequest,
    HealthResponse,
)
from services.gemini_service import (
    GeminiService,
    is_gemini_configured,
    get_model_name,
)

app = FastAPI(
    title="Eventora AI Backend API",
    description="Secure Google Gemini-powered celebration planning engine for Eventora AI",
    version="1.0.0",
)

# -------------------------------------------------------------------------
# CORS Configuration
# -------------------------------------------------------------------------
cors_env = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173",
)
allowed_origins = [origin.strip() for origin in cors_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# -------------------------------------------------------------------------
# Exception Handlers
# -------------------------------------------------------------------------
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": f"An unexpected server error occurred: {str(exc)}"},
    )


# -------------------------------------------------------------------------
# API Endpoints
# -------------------------------------------------------------------------
@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint reporting API status and whether Gemini API key is configured.
    """
    return HealthResponse(
        status="ok",
        gemini_configured=is_gemini_configured(),
        model=get_model_name(),
        version="1.0.0",
    )


@app.post("/api/generate-plan", response_model=Dict[str, Any])
async def generate_plan(request: EventPlanRequest):
    """
    Generate a full celebration blueprint (budget, timeline, vendors, creative ideas)
    using Google Gemini generative AI.
    """
    plan = GeminiService.generate_event_plan(request)
    return plan


@app.post("/api/generate-ideas", response_model=Dict[str, Any])
async def generate_ideas(request: GenerateIdeasRequest):
    """
    Synthesize fresh personalized themes, decor, food, and entertainment concepts
    using Google Gemini generative AI.
    """
    ideas = GeminiService.generate_creative_ideas(request)
    return {"ideas": ideas}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
