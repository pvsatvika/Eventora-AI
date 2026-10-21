import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CreateEventPage } from '../pages/CreateEventPage';
import * as api from '../utils/api';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

vi.mock('../context/EventContext', () => ({
  useEvents: () => ({
    createNewEvent: vi.fn(),
    events: [],
  }),
}));

describe('CreateEventPage Form Validation & Presets', () => {
  beforeEach(() => {
    vi.spyOn(api, 'checkBackendHealth').mockResolvedValue({
      ok: true,
      geminiConfigured: true,
      model: 'gemini-2.5-flash',
    });
  });

  it('renders the celebration creation form with default format options', async () => {
    render(
      <MemoryRouter>
        <CreateEventPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Checking AI Server...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Let’s begin planning your celebration.')).toBeInTheDocument();
    expect(screen.getByText('Wedding & Sangeet')).toBeInTheDocument();
    expect(screen.getByText('Milestone Birthday')).toBeInTheDocument();
    expect(screen.getByText('Community Gathering')).toBeInTheDocument();
  });

  it('populates fields when a quick-fill preset is chosen', async () => {
    render(
      <MemoryRouter>
        <CreateEventPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Checking AI Server...')).not.toBeInTheDocument();
    });

    // Click sample template button "Milestone"
    const milestoneBtn = screen.getByRole('button', { name: 'Milestone' });
    fireEvent.click(milestoneBtn);

    const nameInput = screen.getByPlaceholderText(/e\.g\. Diya & Arjun's Wedding Reception/i);
    expect(nameInput.value).toBe("Aarav's 30th Evening Gathering");
  });

  it('validates required fields and displays error messages on empty submission', async () => {
    render(
      <MemoryRouter>
        <CreateEventPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Checking AI Server...')).not.toBeInTheDocument();
    });

    // Clear the celebration name
    const nameInput = screen.getByPlaceholderText(/e\.g\. Diya & Arjun's Wedding Reception/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    // Submit form button
    const submitBtn = screen.getByRole('button', { name: /Generate.*Event Plan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Please provide a celebration name')).toBeInTheDocument();
    });
  });

  it('triggers plan generation and calls API when submitted with valid fields', async () => {
    const mockGenerate = vi.spyOn(api, 'generateEventPlanWithAI').mockResolvedValue({
      id: 'mock-event-id',
      name: 'Diya & Arjun Wedding',
      budgetCategories: [],
      timelineTasks: [],
      vendors: [],
      aiIdeas: [],
    });

    render(
      <MemoryRouter>
        <CreateEventPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Checking AI Server...')).not.toBeInTheDocument();
    });

    // Populate required fields
    const nameInput = screen.getByPlaceholderText(/e\.g\. Diya & Arjun's Wedding Reception/i);
    fireEvent.change(nameInput, { target: { value: 'Diya & Arjun Wedding' } });

    const locationInput = screen.getByPlaceholderText(/e\.g\. Bengaluru, Karnataka or Jaipur/i);
    fireEvent.change(locationInput, { target: { value: 'Udaipur, Rajasthan' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Generate.*Event Plan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockGenerate).toHaveBeenCalledTimes(1);
    });
  });
});
