import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export const AddTaskModal = ({ isOpen, onClose, onAddTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    phase: '1-2 Months Before',
    category: 'Logistics',
    dueDate: '',
    priority: 'medium',
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
    if (!formData.title.trim()) {
      setErrors({ title: 'Please provide a deliverable description' });
      return;
    }

    onAddTask(formData);

    setFormData({
      title: '',
      phase: '1-2 Months Before',
      category: 'Logistics',
      dueDate: '',
      priority: 'medium',
      notes: '',
    });
    onClose();
  };

  const phases = [
    '3-6 Months Before',
    '1-2 Months Before',
    '1-2 Weeks Before',
    'Day of Event',
    'Post Event',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Timeline Deliverable"
      subtitle="Define actionable tasks to keep your celebration schedule on track"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">
            Deliverable Title *
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Confirm DJ playlist, Finalize seating arrangement"
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
              Timeline Phase
            </label>
            <select
              name="phase"
              value={formData.phase}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3.5 py-2.5 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            >
              {phases.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3.5 py-2.5 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Category
            </label>
            <input
              type="text"
              name="category"
              placeholder="e.g. Venue, Catering, Music"
              value={formData.category}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3.5 py-2.5 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Target Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3.5 py-2 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">
            Notes & Instructions
          </label>
          <textarea
            name="notes"
            rows="2"
            placeholder="Add relevant contact numbers, vendor links or checklist criteria..."
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
            Save Deliverable
          </Button>
        </div>
      </form>
    </Modal>
  );
};
