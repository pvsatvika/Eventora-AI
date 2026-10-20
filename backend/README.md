# Eventora AI — FastAPI & Google Gemini Backend Engine

Secure, high-performance Python FastAPI service powering generative celebration planning for Eventora AI using the official Google Gen AI SDK (`google-genai`).

---

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `backend/.env` and insert your Google Gemini API key:
```env
GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY
GEMINI_MODEL=gemini-2.5-flash
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173
```
> **Get a free Gemini API key**: Visit [Google AI Studio](https://aistudio.google.com/) to create a free API key with zero billing required.

### 3. Start the Backend Server
```bash
python main.py
# or with uvicorn directly:
uvicorn main:app --reload --port 8000
```

The server will be accessible at:
- **API Root**: `http://localhost:8000`
- **Health Check**: `http://localhost:8000/api/health`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

## 📡 API Endpoints

### `GET /api/health`
Returns system status and whether a valid Gemini API key is configured.
```json
{
  "status": "ok",
  "gemini_configured": true,
  "model": "gemini-2.5-flash",
  "version": "1.0.0"
}
```

### `POST /api/generate-plan`
Accepts event criteria and invokes Google Gemini to generate a structured celebration plan.
**Request Payload**:
```json
{
  "event_type": "wedding",
  "event_name": "Aarav & Meera's Sangeet & Reception",
  "event_date": "2026-11-28",
  "location": "Jaipur, Rajasthan",
  "total_budget": 1850000,
  "guest_count": 250,
  "theme_preferences": "Royal Rajputana & Twilight Pastel",
  "special_requirements": "Vegetarian catering and wheelchair accessibility"
}
```

### `POST /api/generate-ideas`
Synthesizes 4 fresh creative concepts (themes, decor, culinary items, entertainment) tailored to the active celebration.

---

## 🔒 Security Best Practices
- The `GEMINI_API_KEY` is strictly held on the server and never sent to the browser.
- `.env` is excluded in `.gitignore`.
- Structured output validation ensures no hallucinated shapes or unexpected types reach the frontend.
