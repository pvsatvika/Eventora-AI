/**
 * Eventora AI Backend API Client
 * Interfaces with the Python FastAPI backend on http://localhost:8000
 */

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${BACKEND_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return { ok: false, geminiConfigured: false, error: `Server returned status ${res.status}` };
    }

    const data = await res.json();
    return {
      ok: true,
      geminiConfigured: Boolean(data.gemini_configured),
      model: data.model || 'gemini-2.5-flash',
    };
  } catch (err) {
    return {
      ok: false,
      geminiConfigured: false,
      error: 'Backend server is offline. Run `python main.py` inside backend/ to enable live AI.',
    };
  }
}

export async function generateEventPlanWithAI(formData) {
  const payload = {
    event_type: formData.type,
    event_name: formData.name,
    event_date: formData.date,
    location: formData.location,
    total_budget: Number(formData.totalBudget),
    guest_count: Number(formData.expectedGuests),
    theme_preferences: formData.theme || null,
    special_requirements: formData.specialRequirements || null,
    existing_completed_tasks: formData.existingCompletedTasks || null,
  };

  const res = await fetch(`${BACKEND_BASE_URL}/api/generate-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.detail || `Server error (${res.status}): Failed to generate AI plan.`;
    const error = new Error(errorMsg);
    error.statusCode = res.status;
    throw error;
  }

  return data;
}

export async function generateIdeasWithAI({ event, category = 'all' }) {
  const payload = {
    event_name: event.name,
    event_type: event.type,
    theme: event.theme || null,
    guest_count: Number(event.expectedGuests) || 100,
    total_budget: Number(event.totalBudget) || 500000,
    location: event.location || 'India',
    category,
  };

  const res = await fetch(`${BACKEND_BASE_URL}/api/generate-ideas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.detail || `Server error (${res.status}): Failed to generate ideas.`;
    const error = new Error(errorMsg);
    error.statusCode = res.status;
    throw error;
  }

  return data.ideas || [];
}
