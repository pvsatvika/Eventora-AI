import React, { useState } from 'react';
import {
  Coins,
  Plus,
  AlertCircle,
  PieChart,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { EventBanner } from '../components/layout/EventBanner';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { BudgetCategoryCard } from '../components/budget/BudgetCategoryCard';
import { ExpenseTable } from '../components/budget/ExpenseTable';
import { AddExpenseModal } from '../components/budget/AddExpenseModal';
import { formatINR } from '../utils/currency';

export const BudgetPage = () => {
  const {
    activeEvent,
    updateBudgetCategory,
    addExpense,
    deleteExpense,
    updateExpense,
  } = useEvents();

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  if (!activeEvent) return null;

  const totalBudget = Number(activeEvent.totalBudget) || 0;
  const categories = activeEvent.budgetCategories || [];
  const expenses = activeEvent.expenses || [];

  // Metrics
  const totalSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalAllocated = categories.reduce((sum, c) => sum + (Number(c.allocated) || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const unallocatedBudget = totalBudget - totalAllocated;
  const paidExpensesTotal = expenses
    .filter((e) => e.paidStatus === 'paid')
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const pendingExpensesTotal = expenses
    .filter((e) => e.paidStatus === 'pending')
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const isOverBudget = totalSpent > totalBudget;

  const handleUpdateAllocated = (catId, newAmount) => {
    updateBudgetCategory(activeEvent.id, catId, newAmount);
  };

  const handleAddExpense = (expenseData) => {
    addExpense(activeEvent.id, expenseData);
  };

  const handleDeleteExpense = (expenseId) => {
    deleteExpense(activeEvent.id, expenseId);
  };

  const handleToggleStatus = (expenseId, updates) => {
    updateExpense(activeEvent.id, expenseId, updates);
  };

  return (
    <div>
      <EventBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-left">
        {/* Header & Log Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl text-charcoal font-normal">
              Budget Planner & Expenses
            </h2>
            <p className="text-sm text-muted mt-1">
              Structure planned category allocations in INR and monitor logged payments
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setIsAddExpenseOpen(true)}
          >
            Record Expense
          </Button>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <span className="text-xs font-medium text-muted block mb-1">
              Celebration Budget
            </span>
            <div className="font-editorial text-2xl text-charcoal font-medium">
              {formatINR(totalBudget)}
            </div>
            <span className="text-xs text-muted block mt-2">
              Allocated: {formatINR(totalAllocated)} ({Math.round((totalAllocated / totalBudget) * 100)}%)
            </span>
          </Card>

          <Card className="p-6">
            <span className="text-xs font-medium text-muted block mb-1">
              Total Logged Expenses
            </span>
            <div className="font-editorial text-2xl text-charcoal font-medium">
              {formatINR(totalSpent)}
            </div>
            <div className="mt-2.5">
              <ProgressBar
                value={totalSpent}
                max={totalBudget || 1}
                color={isOverBudget ? 'bg-rose-600' : 'bg-sage-600'}
                height="h-1.5"
              />
              <span className="text-[11px] text-muted block mt-1">
                {Math.round((totalSpent / totalBudget) * 100)}% of total budget utilized
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted block">
                {remainingBudget >= 0 ? 'Remaining Safe Budget' : 'Budget Overspend Deficit'}
              </span>
              {remainingBudget < 0 && (
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Over Budget
                </span>
              )}
            </div>
            <div
              className={`font-editorial text-2xl font-medium ${
                remainingBudget < 0 ? 'text-rose-700' : 'text-sage-800'
              }`}
            >
              {remainingBudget < 0
                ? `- ${formatINR(Math.abs(remainingBudget))}`
                : formatINR(remainingBudget)}
            </div>
            <span className="text-xs text-muted block mt-2">
              {remainingBudget >= 0
                ? 'Available for pending contracts'
                : 'Over budget by ' + formatINR(Math.abs(remainingBudget))}
            </span>
          </Card>

          <Card className="p-6">
            <span className="text-xs font-medium text-muted block mb-1">
              Settlement Status
            </span>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-muted">Paid & Confirmed:</span>
              <strong className="text-charcoal font-semibold">{formatINR(paidExpensesTotal)}</strong>
            </div>
            <div className="flex items-center justify-between text-xs mt-1.5">
              <span className="text-muted">Pending Balance:</span>
              <strong className="text-charcoal font-semibold">{formatINR(pendingExpensesTotal)}</strong>
            </div>
          </Card>
        </div>

        {/* Warning if over allocated */}
        {unallocatedBudget < 0 && (
          <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
            <span>
              Your category allocations exceed your total budget by {formatINR(Math.abs(unallocatedBudget))}. You can adjust planned amounts directly in the category cards below.
            </span>
          </div>
        )}

        {/* Category Allocation Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-xl text-charcoal font-medium">
              Category Allocations ({categories.length})
            </h3>
            <span className="text-xs text-muted">
              Select pencil to edit planned amounts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const catSpent = expenses
                .filter((e) => e.categoryId === cat.id)
                .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

              return (
                <BudgetCategoryCard
                  key={cat.id}
                  category={cat}
                  spent={catSpent}
                  totalBudget={totalBudget}
                  onUpdateAllocated={handleUpdateAllocated}
                />
              );
            })}
          </div>
        </div>

        {/* Expenses Table */}
        <div className="space-y-4 pt-6 border-t border-stoneborder">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-editorial text-xl text-charcoal font-medium">
                Logged Celebration Expenses ({expenses.length})
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Receipts, advance payments, and vendor contracts
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddExpenseOpen(true)}
            >
              Add Expense
            </Button>
          </div>

          <ExpenseTable
            expenses={expenses}
            categories={categories}
            onDeleteExpense={handleDeleteExpense}
            onToggleStatus={handleToggleStatus}
            onOpenAddModal={() => setIsAddExpenseOpen(true)}
          />
        </div>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        categories={categories}
        onAddExpense={handleAddExpense}
      />
    </div>
  );
};
