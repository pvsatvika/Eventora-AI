# Eventora — Thoughtful Event & Celebration Planning

> Built for **Hack2Skill PromptWars Challenge 5**  
> *"Beautiful moments deserve thoughtful planning."*

Eventora is an editorial-grade celebration and event-planning web application powered by **Google Gemini Generative AI** and a **Python FastAPI** backend. It pairs the serene, tactile warmth of a lifestyle publication with an intelligent celebration operating system for **weddings, milestone birthdays, and community festivals**.

---

## 🎨 Design Identity & Palette

- **Warm Ivory (`#FAF8F4`)**: Ambient canvas across the entire application.
- **Sage Green (`#748C78`) & Dark Sage (`#526B57`)**: Primary botanical tones used for active navigation, key CTAs, and milestone indicators.
- **Muted Blush (`#E9C9C3`)**: Secondary accent for highlights, delicate borders, and category tags.
- **Charcoal (`#252B28`)**: High-contrast editorial typography and primary dark text.
- **Muted Text (`#69716B`)**: Secondary typography for descriptions, metadata, and timestamps.
- **Stone Borders (`#E8E7E1`)**: Crisp, subtle structural dividers.
- **Typography**:
  - **Headings**: *Playfair Display* (classic editorial serif)
  - **Body & Navigation**: *DM Sans* (comfortable 15–16px sizing with high legibility)

---

## 🤖 Full-Stack Gemini AI Architecture

```
Eventora-AI/
├── backend/
│   ├── main.py                  # FastAPI application with CORS and error handling
│   ├── services/
│   │   └── gemini_service.py    # Official google-genai SDK integration & plan mapping
│   ├── models/
│   │   └── schemas.py           # Pydantic request/response & structured Gemini schemas
│   ├── requirements.txt         # fastapi, uvicorn, google-genai, python-dotenv, pydantic
│   ├── .env.example             # Template for GEMINI_API_KEY & GEMINI_MODEL
│   └── README.md                # Dedicated backend documentation
│
├── src/                         # React 19 + Vite frontend
│   ├── context/EventContext.jsx # LocalStorage persistence & active event state
│   ├── utils/api.js             # Client for /api/health, /api/generate-plan, /api/generate-ideas
│   ├── pages/CreateEventPage.jsx# Interactive form with live Gemini AI / Demo engine toggle
│   └── pages/IdeasPage.jsx      # AI-powered concept synthesizer
```

---

## 🚀 Setup & Execution

### 1. Configure Backend Environment
Copy the example environment file inside `backend/`:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` to configure your Google Gemini API key:
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMINI_MODEL=gemini-2.5-flash
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173
```
> **Get a Free API Key**: Visit [Google AI Studio](https://aistudio.google.com/) to obtain a free Gemini API key with zero billing required.

### 2. Start the FastAPI Backend
```bash
cd backend
python main.py
# or using uvicorn:
uvicorn main:app --reload --port 8000
```
- API Health Check: `http://localhost:8000/api/health`
- Swagger UI Docs: `http://localhost:8000/docs`

### 3. Start the React Frontend
In a separate terminal window at the project root:
```bash
npm run dev
```
- Open `http://localhost:5173/` in your browser.

---

## 📡 Backend API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns backend status, configured Gemini model, and whether the API key is active |
| `POST` | `/api/generate-plan` | Synthesizes an entire celebration blueprint with structured budgets, timelines, vendors, and ideas |
| `POST` | `/api/generate-ideas` | Generates 4 fresh creative concepts (themes, decor, culinary items, entertainment) |

---

## 🔒 Security & Data Integrity

- **Server-Side API Key**: The `GEMINI_API_KEY` is strictly confined to the Python backend; it is never exposed to the frontend bundle or client network payloads.
- **Pydantic Validation**: All inputs and Gemini outputs are strictly validated against Pydantic schemas.
- **Informative Error Handling**: If no API key is provided, quota is exceeded, or invalid parameters are entered, the system returns clear, human-readable errors without silently fabricating synthetic AI results.
- **Local Demo Engine**: When running offline or without an API key, users can effortlessly toggle to the Local Demo Engine to explore the full dashboard experience.
