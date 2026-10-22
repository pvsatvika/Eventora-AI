import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { getInitialEvents } from '../data/initialEvents';

const mockToggleTask = vi.fn();
let mockActiveEvent = null;
let mockEvents = [];

vi.mock('../context/EventContext', () => ({
  useEvents: () => ({
    activeEvent: mockActiveEvent,
    events: mockEvents,
    setActiveEventId: vi.fn(),
    toggleTask: mockToggleTask,
  }),
}));

describe('DashboardPage Component & Runtime Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dashboard with an active celebration without crashing', () => {
    const sampleEvents = getInitialEvents();
    mockActiveEvent = sampleEvents[0];
    mockEvents = sampleEvents;

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    // Verify readiness heading and event metrics
    expect(screen.getByText('Celebration Execution Status')).toBeInTheDocument();
    expect(screen.getByText(/Planning is \d+% Complete/)).toBeInTheDocument();
    expect(screen.getByText('Target Celebration Budget')).toBeInTheDocument();
    expect(screen.getByText('Logged Expenses')).toBeInTheDocument();
    expect(screen.getByText('Milestones Progress')).toBeInTheDocument();

    // Verify navigation buttons rendered with ArrowRight icon do not crash
    expect(screen.getByRole('button', { name: /All Tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Manage Budget/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Checklist/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ideas Hub/i })).toBeInTheDocument();
  });

  it('renders empty fallback when no celebration is active', () => {
    mockActiveEvent = null;
    mockEvents = [];

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('No Active Celebration')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Plan an Event' })).toBeInTheDocument();
  });

  it('interacts with deliverable checkboxes without errors', () => {
    const sampleEvents = getInitialEvents();
    mockActiveEvent = sampleEvents[0];
    mockEvents = sampleEvents;

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
    fireEvent.click(checkboxes[0]);
    expect(mockToggleTask).toHaveBeenCalled();
  });
});
