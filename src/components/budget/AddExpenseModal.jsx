import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export const AddExpenseModal = ({
  isOpen,
  onClose,
  categories = [],
  onAddExpense,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    categoryId: categories[0]?.id || '',
    amount: '',
    paidStatus: 'paid',
    vendorName: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Please provide an expense title';
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount in INR';
    }
    if (!formData.categoryId) newErrors.categoryId = 'Please select a category';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddExpense({
      ...formData,
      amount: Number(formData.amount),
    });

    setFormData({
      title: '',
      categoryId: categories[0]?.id || '',
      amount: '',
      paidStatus: 'paid',
      vendorName: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Celebration Expense"
      subtitle="Log an actual or contracted payment in Indian Rupees (₹)"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">
            Expense Description *
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Venue Booking Advance, Sound System Deposit"
            value={formData.title}
            onChange={handleChange}
            className={`w-full text-sm rounded-xl border px-3.5 py-2.5 bg-ivory/50 focus:bg-white focus:ring-1 focus:ring-sage-600 focus:outline-none transition-colors ${
              errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-stoneborder'
            }`}
          />
          {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Category *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3.5 py-2.5 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Amount in INR (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm">
                ₹
              </span>
              <input
                type="number"
                name="amount"
                placeholder="50000"
                value={formData.amount}
                onChange={handleChange}
                className={`w-full text-sm rounded-xl border pl-8 pr-3.5 py-2.5 bg-ivory/50 focus:bg-white focus:ring-1 focus:ring-sage-600 focus:outline-none transition-colors ${
                  errors.amount ? 'border-rose-400 bg-rose-50/20' : 'border-stoneborder'
                }`}
              />
            </div>
            {errors.amount && <p className="text-xs text-rose-600 mt-1">{errors.amount}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Payment Status
            </label>
            <select
              name="paidStatus"
              value={formData.paidStatus}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3.5 py-2.5 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            >
              <option value="paid">Paid & Confirmed</option>
              <option value="pending">Pending Payment</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Payment Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3.5 py-2 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">
            Payee / Vendor Name (Optional)
          </label>
          <input
            type="text"
            name="vendorName"
            placeholder="e.g. Royal Heritage Caterers"
            value={formData.vendorName}
            onChange={handleChange}
            className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3.5 py-2.5 focus:ring-1 focus:ring-sage-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">
            Receipt Reference / Notes
          </label>
          <textarea
            name="notes"
            rows="2"
            placeholder="e.g. Advance receipt #402, 50% deposit for 250 guests"
            value={formData.notes}
            onChange={handleChange}
            className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3.5 py-2 focus:ring-1 focus:ring-sage-600 focus:outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stoneborder">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Plus}>
            Record Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};
