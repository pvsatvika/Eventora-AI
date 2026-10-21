import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExpenseTable } from '../components/budget/ExpenseTable';

describe('ExpenseTable Component & Accessibility', () => {
  const mockCategories = [
    { id: 'cat-venue', name: 'Venue & Banquets' },
    { id: 'cat-catering', name: 'Catering & Food' },
    { id: 'cat-decor', name: 'Floral & Decor' },
  ];

  const mockExpenses = [
    {
      id: 'exp-1',
      title: 'Banquet Hall Advance Deposit',
      vendorName: 'Heritage Palace',
      categoryId: 'cat-venue',
      date: '2027-01-15',
      amount: 250000,
      paidStatus: 'paid',
      notes: '50% advance booking fee',
    },
    {
      id: 'exp-2',
      title: 'Artisanal Floral Mandap Setup',
      vendorName: 'Petals & Blooms',
      categoryId: 'cat-decor',
      date: '2027-02-10',
      amount: 80000,
      paidStatus: 'pending',
      notes: 'Balance due upon installation',
    },
    {
      id: 'exp-3',
      title: 'Tasting Session & Menu Finalization',
      vendorName: 'Royal Spice Catering',
      categoryId: 'cat-catering',
      date: '2027-02-20',
      amount: 15000,
      paidStatus: 'paid',
      notes: 'Chef tasting fee for 6 guests',
    },
  ];

  it('renders table with accessible name and column headers', () => {
    render(
      <ExpenseTable
        expenses={mockExpenses}
        categories={mockCategories}
        onDeleteExpense={vi.fn()}
        onToggleStatus={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    );

    expect(screen.getByRole('table', { name: 'Celebration Expenses Ledger' })).toBeInTheDocument();
    expect(screen.getByText('Expense & Payee')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Amount (INR)')).toBeInTheDocument();
  });

  it('filters expenses by search term matching title or payee', () => {
    render(
      <ExpenseTable
        expenses={mockExpenses}
        categories={mockCategories}
        onDeleteExpense={vi.fn()}
        onToggleStatus={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    );

    const searchInput = screen.getByLabelText('Search expense, vendor, or receipt');
    fireEvent.change(searchInput, { target: { value: 'Petals' } });

    expect(screen.getByText('Artisanal Floral Mandap Setup')).toBeInTheDocument();
    expect(screen.queryByText('Banquet Hall Advance Deposit')).not.toBeInTheDocument();
    expect(screen.queryByText('Tasting Session & Menu Finalization')).not.toBeInTheDocument();
  });

  it('filters expenses by category dropdown', () => {
    render(
      <ExpenseTable
        expenses={mockExpenses}
        categories={mockCategories}
        onDeleteExpense={vi.fn()}
        onToggleStatus={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    );

    const catSelect = screen.getByLabelText('Filter expenses by category');
    fireEvent.change(catSelect, { target: { value: 'cat-catering' } });

    expect(screen.getByText('Tasting Session & Menu Finalization')).toBeInTheDocument();
    expect(screen.queryByText('Banquet Hall Advance Deposit')).not.toBeInTheDocument();
    expect(screen.queryByText('Artisanal Floral Mandap Setup')).not.toBeInTheDocument();
  });

  it('filters expenses by payment status dropdown', () => {
    render(
      <ExpenseTable
        expenses={mockExpenses}
        categories={mockCategories}
        onDeleteExpense={vi.fn()}
        onToggleStatus={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    );

    const statusSelect = screen.getByLabelText('Filter expenses by payment status');
    fireEvent.change(statusSelect, { target: { value: 'pending' } });

    expect(screen.getByText('Artisanal Floral Mandap Setup')).toBeInTheDocument();
    expect(screen.queryByText('Banquet Hall Advance Deposit')).not.toBeInTheDocument();
    expect(screen.queryByText('Tasting Session & Menu Finalization')).not.toBeInTheDocument();
  });

  it('invokes onToggleStatus with opposite status when status badge is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <ExpenseTable
        expenses={mockExpenses}
        categories={mockCategories}
        onDeleteExpense={vi.fn()}
        onToggleStatus={handleToggle}
        onOpenAddModal={vi.fn()}
      />
    );

    // Click status toggle for exp-1 (currently paid -> pending)
    const togglePaidBtn = screen.getByLabelText('Toggle payment status for "Banquet Hall Advance Deposit". Currently paid');
    fireEvent.click(togglePaidBtn);
    expect(handleToggle).toHaveBeenCalledWith('exp-1', { paidStatus: 'pending' });

    // Click status toggle for exp-2 (currently pending -> paid)
    const togglePendingBtn = screen.getByLabelText('Toggle payment status for "Artisanal Floral Mandap Setup". Currently pending');
    fireEvent.click(togglePendingBtn);
    expect(handleToggle).toHaveBeenCalledWith('exp-2', { paidStatus: 'paid' });
  });

  it('invokes onDeleteExpense when delete button is clicked', () => {
    const handleDelete = vi.fn();
    render(
      <ExpenseTable
        expenses={mockExpenses}
        categories={mockCategories}
        onDeleteExpense={handleDelete}
        onToggleStatus={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    );

    const deleteBtn = screen.getByLabelText('Delete expense "Artisanal Floral Mandap Setup"');
    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith('exp-2');
  });

  it('displays EmptyState when no expenses match search criteria', () => {
    render(
      <ExpenseTable
        expenses={mockExpenses}
        categories={mockCategories}
        onDeleteExpense={vi.fn()}
        onToggleStatus={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    );

    const searchInput = screen.getByLabelText('Search expense, vendor, or receipt');
    fireEvent.change(searchInput, { target: { value: 'NonexistentExpenseKeyword' } });

    expect(screen.getByText('No expenses recorded')).toBeInTheDocument();
    expect(screen.getByText('Try clearing your search filters to view your logged expenses.')).toBeInTheDocument();
  });
});
