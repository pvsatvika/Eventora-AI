import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  API_BASE_URL,
  checkBackendHealth,
  generateEventPlanWithAI,
  generateIdeasWithAI,
} from '../utils/api';

describe('Frontend API Client (src/utils/api.js)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('guarantees API_BASE_URL has no trailing slash', () => {
    expect(API_BASE_URL).not.toMatch(/\/$/);
  });

  it('checkBackendHealth returns ok=true when backend responds 200', async () => {
    const mockHealth = {
      status: 'ok',
      gemini_configured: true,
      model: 'gemini-2.5-flash',
      version: '1.0.0',
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockHealth,
    });

    const result = await checkBackendHealth();
    expect(result.ok).toBe(true);
    expect(result.geminiConfigured).toBe(true);
    expect(result.model).toBe('gemini-2.5-flash');
  });

  it('checkBackendHealth handles offline or aborted network gracefully', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    const result = await checkBackendHealth();
    expect(result.ok).toBe(false);
    expect(result.geminiConfigured).toBe(false);
    expect(result.error).toContain('offline');
  });

  it('generateEventPlanWithAI posts structured payload and returns response', async () => {
    const fakePlan = { id: 'evt-1', name: 'My Wedding', budgetCategories: [] };
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => fakePlan,
    });

    const formData = {
      type: 'wedding',
      name: 'My Wedding',
      date: '2027-04-10',
      location: 'Jaipur',
      totalBudget: 1500000,
      expectedGuests: 200,
      theme: 'Royal Rajputana',
      specialRequirements: 'Vegetarian',
    };

    const res = await generateEventPlanWithAI(formData);
    expect(res.name).toBe('My Wedding');
    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/generate-plan`,
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('generateEventPlanWithAI throws descriptive error on server failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({ detail: 'Gemini not configured' }),
    });

    const formData = {
      type: 'birthday',
      name: 'Party',
      date: '2027-04-10',
      location: 'Goa',
      totalBudget: 100000,
      expectedGuests: 50,
    };

    await expect(generateEventPlanWithAI(formData)).rejects.toThrow('Gemini not configured');
  });

  it('generateIdeasWithAI posts payload and returns ideas list', async () => {
    const fakeIdeas = [{ id: 'idea-1', title: 'Acoustic Trio' }];
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ideas: fakeIdeas }),
    });

    const event = {
      name: 'Aarav 30th',
      type: 'birthday',
      expectedGuests: 50,
      totalBudget: 100000,
    };

    const ideas = await generateIdeasWithAI({ event, category: 'all' });
    expect(ideas.length).toBe(1);
    expect(ideas[0].title).toBe('Acoustic Trio');
  });
});
