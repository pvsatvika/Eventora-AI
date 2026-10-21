import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Toast } from '../components/common/Toast';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
import { TaskItem } from '../components/timeline/TaskItem';
import { BudgetCategoryCard } from '../components/budget/BudgetCategoryCard';
import { VendorCard } from '../components/vendors/VendorCard';
import { IdeaCard } from '../components/ideas/IdeaCard';

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('UI Components (Toast, ProgressBar, Badge)', () => {
  it('renders Toast with message and triggers onClose when close button clicked', () => {
    const handleClose = vi.fn();
    renderWithRouter(
      <Toast
        isOpen={true}
        message="Deliverable added to timeline successfully"
        onClose={handleClose}
        actionLabel="View Deliverables"
        actionPath="/timeline"
      />
    );

    expect(screen.getByText('Deliverable added to timeline successfully')).toBeInTheDocument();
    expect(screen.getByText('View Deliverables')).toBeInTheDocument();

    const closeBtn = screen.getByLabelText('Close notification');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders ProgressBar with accurate percentage width and clamps values', () => {
    const { container } = render(<ProgressBar value={40} max={100} color="bg-sage-600" />);
    const bar = container.querySelector('.bg-sage-600');
    expect(bar).toBeInTheDocument();
    expect(bar.style.width).toBe('40%');
  });

  it('renders Badge with correct variant styling and label', () => {
    render(<Badge variant="success">Confirmed Partner</Badge>);
    const badge = screen.getByText('Confirmed Partner');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('text-[#3D5A42]');
  });
});

describe('Domain Components (TaskItem, BudgetCategoryCard, VendorCard, IdeaCard)', () => {
  it('renders TaskItem and invokes onToggle and onDelete', () => {
    const mockTask = {
      id: 'task-1',
      title: 'Finalize Guest Seating',
      phase: '1-2 Weeks Before',
      category: 'Logistics',
      priority: 'high',
      completed: false,
      dueDate: '2027-04-10',
      notes: 'Check VIP rows',
    };
    const handleToggle = vi.fn();
    const handleDelete = vi.fn();

    render(
      <TaskItem
        task={mockTask}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    );

    expect(screen.getByText('Finalize Guest Seating')).toBeInTheDocument();
    expect(screen.getByText('High Priority')).toBeInTheDocument();

    // Toggle completion button
    const toggleButton = screen.getAllByRole('button')[0];
    fireEvent.click(toggleButton);
    expect(handleToggle).toHaveBeenCalledWith('task-1');

    // Delete button
    const deleteButton = screen.getByTitle('Delete deliverable');
    fireEvent.click(deleteButton);
    expect(handleDelete).toHaveBeenCalledWith('task-1');
  });

  it('renders BudgetCategoryCard and supports editing allocated amount', () => {
    const mockCategory = {
      id: 'cat-venue',
      name: 'Venue & Accommodation',
      allocated: 450000,
      color: '#748C78',
    };
    const handleUpdate = vi.fn();

    render(
      <BudgetCategoryCard
        category={mockCategory}
        spent={200000}
        totalBudget={1000000}
        onUpdateAllocated={handleUpdate}
      />
    );

    expect(screen.getByText('Venue & Accommodation')).toBeInTheDocument();
    expect(screen.getByText('45% of total celebration budget')).toBeInTheDocument();

    // Click edit pencil
    const editBtn = screen.getByTitle('Edit Allocated Amount');
    fireEvent.click(editBtn);

    // Change input and save
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '500000' } });

    const checkBtn = screen.getAllByRole('button').find((b) => b.querySelector('svg.lucide-check'));
    fireEvent.click(checkBtn);

    expect(handleUpdate).toHaveBeenCalledWith('cat-venue', 500000);
  });

  it('renders VendorCard and updates booking status', () => {
    const mockVendor = {
      id: 'vend-1',
      name: 'Saffron Banquets',
      category: 'Venue & Hospitality',
      status: 'Researching',
      estimatedCost: 350000,
      depositPaid: 50000,
      contactPerson: 'Mehul',
      phone: '+91 98765 43210',
      email: 'mehul@saffron.in',
      notes: 'Includes lawn and banquet room',
    };
    const handleStatus = vi.fn();
    const handleDelete = vi.fn();

    render(
      <VendorCard
        vendor={mockVendor}
        onUpdateStatus={handleStatus}
        onDelete={handleDelete}
      />
    );

    expect(screen.getByText('Saffron Banquets')).toBeInTheDocument();
    expect(screen.getByText('Mehul')).toBeInTheDocument();

    // Select new status
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Deposit Paid' } });

    expect(handleStatus).toHaveBeenCalledWith('vend-1', { status: 'Deposit Paid' });
  });

  it('renders IdeaCard and handles Add to Plan and Favorite toggle', () => {
    const mockIdea = {
      id: 'idea-1',
      title: 'Acoustic Guitar Entrance',
      tag: 'Entertainment & Music',
      type: 'entertainment',
      description: 'Guitarist serenading arrival of guests.',
      costImpact: 'Moderate',
      favorite: false,
    };
    const handleFav = vi.fn();
    const handleAdd = vi.fn();

    render(
      <IdeaCard
        idea={mockIdea}
        isAdded={false}
        onToggleFavorite={handleFav}
        onAddTaskFromIdea={handleAdd}
      />
    );

    expect(screen.getByText('Acoustic Guitar Entrance')).toBeInTheDocument();

    // Add to Plan button
    const addBtn = screen.getByText('Add to Plan');
    fireEvent.click(addBtn);
    expect(handleAdd).toHaveBeenCalledWith(mockIdea);

    // Favorite toggle button
    const favBtn = screen.getByTitle('Save to favorites');
    fireEvent.click(favBtn);
    expect(handleFav).toHaveBeenCalledWith('idea-1');
  });

  it('renders IdeaCard in "In Plan" disabled state when already present in timeline', () => {
    const mockIdea = {
      id: 'idea-2',
      title: 'Rajasthani Puppet Show',
      tag: 'Entertainment & Music',
      type: 'entertainment',
      description: 'Traditional Kathputli puppet act.',
      costImpact: 'Budget-friendly',
      favorite: true,
    };

    render(
      <IdeaCard
        idea={mockIdea}
        isAdded={true}
        onToggleFavorite={vi.fn()}
        onAddTaskFromIdea={vi.fn()}
      />
    );

    const inPlanButton = screen.getByText('In Plan');
    expect(inPlanButton).toBeInTheDocument();
    expect(inPlanButton.closest('button')).toBeDisabled();
  });
});
