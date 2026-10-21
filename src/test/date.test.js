import { describe, it, expect } from 'vitest';
import {
  formatDate,
  getDaysUntil,
  getFutureDateString,
  calculateIdeaDeliverableDetails,
} from '../utils/date';

describe('Date Utilities (formatDate, getDaysUntil, getFutureDateString)', () => {
  it('formats ISO date string into readable Month Day, Year', () => {
    const formatted = formatDate('2027-04-15');
    expect(formatted).toBe('15 Apr 2027');
  });

  it('handles invalid or empty dates gracefully', () => {
    expect(formatDate(null)).toBe('TBD');
    expect(formatDate('')).toBe('TBD');
    expect(formatDate('invalid-date')).toBe('invalid-date');
  });

  it('calculates days until a future date with correct label', () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    const dateStr = future.toISOString().split('T')[0];

    const result = getDaysUntil(dateStr);
    expect(result.days).toBeGreaterThanOrEqual(9);
    expect(result.isPast).toBe(false);
    expect(result.label).toContain('days to go');
  });

  it('detects past dates correctly', () => {
    const past = new Date();
    past.setDate(past.getDate() - 5);
    const dateStr = past.toISOString().split('T')[0];

    const result = getDaysUntil(dateStr);
    expect(result.isPast).toBe(true);
    expect(result.label).toContain('days ago');
  });

  it('handles today date properly', () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const result = getDaysUntil(todayStr);
    expect(result.days).toBe(0);
    expect(result.isPast).toBe(false);
    expect(result.label).toBe('Today is the day! 🎉');
  });

  it('generates future date string exactly N days ahead', () => {
    const futureStr = getFutureDateString(30);
    expect(futureStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const parts = futureStr.split('-').map(Number);
    const targetDt = new Date(parts[0], parts[1] - 1, parts[2]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((targetDt - today) / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(30);
  });
});

describe('calculateIdeaDeliverableDetails (Smart Idea -> Timeline Deadline Scheduling)', () => {
  it('assigns 30-day offset for theme and aesthetic concepts with ample runway', () => {
    const eventDate = getFutureDateString(90); // 90 days away
    const idea = {
      type: 'theme',
      tag: 'Theme & Aesthetic',
      title: 'Royal Rajasthani Heritage',
    };

    const details = calculateIdeaDeliverableDetails(idea, eventDate);
    const partsT = details.dueDate.split('-').map(Number);
    const targetDt = new Date(partsT[0], partsT[1] - 1, partsT[2]);
    const partsE = eventDate.split('-').map(Number);
    const eventDt = new Date(partsE[0], partsE[1] - 1, partsE[2]);
    const daysBefore = Math.round((eventDt - targetDt) / (1000 * 60 * 60 * 24));

    expect(daysBefore).toBe(30);
    expect(details.phase).toBe('1-2 Months Before');
  });

  it('assigns 21-day offset for entertainment concepts with ample runway', () => {
    const eventDate = getFutureDateString(60);
    const idea = {
      type: 'entertainment',
      tag: 'Entertainment & Music',
      title: 'Live Sufi Ensemble',
    };

    const details = calculateIdeaDeliverableDetails(idea, eventDate);
    const partsT = details.dueDate.split('-').map(Number);
    const targetDt = new Date(partsT[0], partsT[1] - 1, partsT[2]);
    const partsE = eventDate.split('-').map(Number);
    const eventDt = new Date(partsE[0], partsE[1] - 1, partsE[2]);
    const daysBefore = Math.round((eventDt - targetDt) / (1000 * 60 * 60 * 24));

    expect(daysBefore).toBe(21);
    expect(details.phase).toBe('1-2 Months Before');
  });

  it('assigns 14-day offset for decor and food concepts', () => {
    const eventDate = getFutureDateString(45);
    const decorIdea = {
      type: 'decor',
      tag: 'Decor & Styling',
      title: 'Marigold Garland Wall',
    };

    const details = calculateIdeaDeliverableDetails(decorIdea, eventDate);
    const partsT = details.dueDate.split('-').map(Number);
    const targetDt = new Date(partsT[0], partsT[1] - 1, partsT[2]);
    const partsE = eventDate.split('-').map(Number);
    const eventDt = new Date(partsE[0], partsE[1] - 1, partsE[2]);
    const daysBefore = Math.round((eventDt - targetDt) / (1000 * 60 * 60 * 24));

    expect(daysBefore).toBe(14);
    expect(details.phase).toBe('1-2 Weeks Before');
  });

  it('compresses runway proportionally when event is sooner than ideal offset', () => {
    const eventDate = getFutureDateString(10);
    const idea = {
      type: 'decor',
      tag: 'Decor & Styling',
      title: 'Floral Arch',
    };

    const details = calculateIdeaDeliverableDetails(idea, eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const partsT = details.dueDate.split('-').map(Number);
    const targetDt = new Date(partsT[0], partsT[1] - 1, partsT[2]);
    const partsE = eventDate.split('-').map(Number);
    const eventDt = new Date(partsE[0], partsE[1] - 1, partsE[2]);

    expect(targetDt.getTime()).toBeGreaterThanOrEqual(today.getTime());
    expect(targetDt.getTime()).toBeLessThanOrEqual(eventDt.getTime());
  });

  it('handles events occurring today by assigning same-day deadline', () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const idea = {
      type: 'food',
      tag: 'Food & Menu',
      title: 'Signature Mocktails',
    };

    const details = calculateIdeaDeliverableDetails(idea, todayStr);
    expect(details.dueDate).toBe(todayStr);
    expect(details.phase).toBe('Day of Event');
  });
});
