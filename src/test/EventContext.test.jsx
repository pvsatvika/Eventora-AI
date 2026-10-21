import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { EventProvider, useEvents } from '../context/EventContext';

describe('EventContext & State Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }) => <EventProvider>{children}</EventProvider>;

  it('initializes with sample events and an active event', () => {
    const { result } = renderHook(() => useEvents(), { wrapper });
    expect(result.current.events.length).toBeGreaterThan(0);
    expect(result.current.activeEvent).toBeDefined();
    expect(result.current.activeEvent.id).toBe(result.current.activeEventId);
  });

  it('creates a new event and sets it as the active event', () => {
    const { result } = renderHook(() => useEvents(), { wrapper });

    let createdId;
    act(() => {
      const newEvent = result.current.createNewEvent({
        name: 'Grand Silver Jubilee',
        type: 'community',
        date: '2027-08-15',
        location: 'Mumbai',
        totalBudget: 800000,
        expectedGuests: 350,
      });
      createdId = newEvent.id;
    });

    expect(result.current.activeEventId).toBe(createdId);
    expect(result.current.activeEvent.name).toBe('Grand Silver Jubilee');
    expect(result.current.events.some((e) => e.id === createdId)).toBe(true);
  });

  it('updates category budget allocation', () => {
    const { result } = renderHook(() => useEvents(), { wrapper });
    const activeEvt = result.current.activeEvent;
    const catId = activeEvt.budgetCategories[0].id;

    act(() => {
      result.current.updateBudgetCategory(activeEvt.id, catId, 550000);
    });

    const updatedCat = result.current.activeEvent.budgetCategories.find((c) => c.id === catId);
    expect(updatedCat.allocated).toBe(550000);
  });

  it('adds, toggles paid status, and deletes an expense', () => {
    const { result } = renderHook(() => useEvents(), { wrapper });
    const activeEvt = result.current.activeEvent;
    const catId = activeEvt.budgetCategories[0].id;

    // 1. Add expense
    act(() => {
      result.current.addExpense(activeEvt.id, {
        title: 'Lawn Advance Deposit',
        amount: 150000,
        categoryId: catId,
        vendorName: 'Palace Grounds',
        date: '2026-11-01',
        paidStatus: 'paid',
        notes: 'Token advance receipt #101',
      });
    });

    const added = result.current.activeEvent.expenses.find((e) => e.title === 'Lawn Advance Deposit');
    expect(added).toBeDefined();
    expect(added.amount).toBe(150000);
    expect(added.paidStatus).toBe('paid');

    // 2. Toggle status
    act(() => {
      result.current.updateExpense(activeEvt.id, added.id, { paidStatus: 'pending' });
    });
    const updated = result.current.activeEvent.expenses.find((e) => e.id === added.id);
    expect(updated.paidStatus).toBe('pending');

    // 3. Delete expense
    act(() => {
      result.current.deleteExpense(activeEvt.id, added.id);
    });
    const remaining = result.current.activeEvent.expenses.find((e) => e.id === added.id);
    expect(remaining).toBeUndefined();
  });

  it('toggles deliverable task completion status and adds new tasks', () => {
    const { result } = renderHook(() => useEvents(), { wrapper });
    const activeEvt = result.current.activeEvent;
    const task = activeEvt.timelineTasks[0];
    const initialCompleted = task.completed;

    // 1. Toggle task
    act(() => {
      result.current.toggleTask(activeEvt.id, task.id);
    });
    const toggled = result.current.activeEvent.timelineTasks.find((t) => t.id === task.id);
    expect(toggled.completed).toBe(!initialCompleted);

    // 2. Add custom task
    act(() => {
      result.current.addTask(activeEvt.id, {
        title: 'Curate Couple Entry Playlist',
        phase: '1-2 Weeks Before',
        category: 'Music',
        dueDate: '2027-02-01',
        priority: 'high',
        notes: 'Song shortlist',
      });
    });

    const newTask = result.current.activeEvent.timelineTasks.find((t) => t.title === 'Curate Couple Entry Playlist');
    expect(newTask).toBeDefined();
    expect(newTask.priority).toBe('high');
  });

  it('updates vendor booking status and adds new vendors', () => {
    const { result } = renderHook(() => useEvents(), { wrapper });
    const activeEvt = result.current.activeEvent;
    const vendor = activeEvt.vendors[0];

    // 1. Update status
    act(() => {
      result.current.updateVendor(activeEvt.id, vendor.id, { status: 'Booked' });
    });
    const updatedVendor = result.current.activeEvent.vendors.find((v) => v.id === vendor.id);
    expect(updatedVendor.status).toBe('Booked');

    // 2. Add custom vendor
    act(() => {
      result.current.addVendor(activeEvt.id, {
        name: 'Artisan Chai Cart',
        category: 'Catering',
        contactPerson: 'Vikram',
        estimatedCost: 25000,
        depositPaid: 5000,
      });
    });
    const newVendor = result.current.activeEvent.vendors.find((v) => v.name === 'Artisan Chai Cart');
    expect(newVendor).toBeDefined();
    expect(newVendor.estimatedCost).toBe(25000);
    expect(newVendor.depositPaid).toBe(5000);
  });

  it('toggles idea favorite bookmark and adds custom ideas', () => {
    const { result } = renderHook(() => useEvents(), { wrapper });
    const activeEvt = result.current.activeEvent;
    const idea = activeEvt.aiIdeas[0];
    const initialFav = Boolean(idea.favorite);

    act(() => {
      result.current.toggleIdeaFavorite(activeEvt.id, idea.id);
    });
    const toggledIdea = result.current.activeEvent.aiIdeas.find((i) => i.id === idea.id);
    expect(toggledIdea.favorite).toBe(!initialFav);

    act(() => {
      result.current.addCustomIdea(activeEvt.id, {
        title: 'Midnight Fireworks & Sparkler Exit',
        type: 'entertainment',
        tag: 'Entertainment & Fun',
        description: 'Cold pyrotechnics for couple send-off',
      });
    });
    const addedIdea = result.current.activeEvent.aiIdeas.find((i) => i.title === 'Midnight Fireworks & Sparkler Exit');
    expect(addedIdea).toBeDefined();
    expect(addedIdea.favorite).toBe(true);
  });
});
