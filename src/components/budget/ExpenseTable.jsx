import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  Clock,
  Trash2,
  Receipt,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatINR } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { EmptyState } from '../common/EmptyState';

export const ExpenseTable = ({
  expenses = [],
  categories = [],
  onDeleteExpense,
  onToggleStatus,
  onOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filtered = expenses.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.vendorName && item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCat === 'all' || item.categoryId === selectedCat;
    const matchesStatus = selectedStatus === 'all' || item.paidStatus === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const getCategoryName = (catId) => {
    return categories.find((c) => c.id === catId)?.name || 'General';
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stoneborder shadow-subtle">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search expense, vendor, receipt..."
            aria-label="Search expense, vendor, or receipt"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-stoneborder focus:outline-none focus:ring-1 focus:ring-sage-600 bg-ivory/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            aria-label="Filter expenses by category"
            className="text-xs bg-white border border-stoneborder rounded-xl px-3 py-2 text-charcoal font-medium focus:outline-none focus:ring-1 focus:ring-sage-600 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter expenses by payment status"
            className="text-xs bg-white border border-stoneborder rounded-xl px-3 py-2 text-charcoal font-medium focus:outline-none focus:ring-1 focus:ring-sage-600 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses recorded"
          description={
            expenses.length === 0
              ? 'Start tracking your celebration budget by recording your first payment or deposit.'
              : 'Try clearing your search filters to view your logged expenses.'
          }
          actionLabel={expenses.length === 0 ? 'Record Expense' : undefined}
          onAction={onOpenAddModal}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-stoneborder bg-white shadow-card">
          <table className="w-full text-left border-collapse" aria-label="Celebration Expenses Ledger">
            <thead>
              <tr className="border-b border-stoneborder bg-ivory/60 text-[11px] font-semibold uppercase tracking-wider text-muted">
                <th scope="col" className="py-3 px-5">Expense & Payee</th>
                <th scope="col" className="py-3 px-5">Category</th>
                <th scope="col" className="py-3 px-5">Date</th>
                <th scope="col" className="py-3 px-5">Status</th>
                <th scope="col" className="py-3 px-5 text-right">Amount (INR)</th>
                <th scope="col" className="py-3 px-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stoneborder text-sm">
              {filtered.map((exp) => {
                const isPaid = exp.paidStatus === 'paid';
                return (
                  <tr
                    key={exp.id}
                    className="hover:bg-ivory/50 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="font-medium text-charcoal">{exp.title}</div>
                      {exp.vendorName && (
                        <div className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
                          <span>Payee:</span>
                          <span className="font-medium text-charcoal">{exp.vendorName}</span>
                        </div>
                      )}
                      {exp.notes && (
                        <p className="text-[11px] text-muted italic mt-0.5">{exp.notes}</p>
                      )}
                    </td>

                    <td className="py-4 px-5">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-ivory border border-stoneborder text-charcoal">
                        {getCategoryName(exp.categoryId)}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-xs text-muted">
                      {formatDate(exp.date)}
                    </td>

                    <td className="py-4 px-5">
                      <button
                        onClick={() =>
                          onToggleStatus(
                            exp.id,
                            isPaid ? { paidStatus: 'pending' } : { paidStatus: 'paid' }
                          )
                        }
                        className="cursor-pointer focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none rounded"
                        title="Click to toggle status"
                        aria-label={`Toggle payment status for "${exp.title}". Currently ${isPaid ? 'paid' : 'pending'}`}
                      >
                        <Badge
                          variant={isPaid ? 'success' : 'warning'}
                          size="xs"
                        >
                          {isPaid ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-[#3D5A42]" />
                              Paid
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-[#8C6228]" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </button>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <span className="font-editorial text-base text-charcoal font-medium">
                        {formatINR(exp.amount)}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => onDeleteExpense(exp.id)}
                        className="p-1.5 rounded-lg text-muted hover:text-rose-700 hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none transition-colors"
                        title="Delete expense"
                        aria-label={`Delete expense "${exp.title}"`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
