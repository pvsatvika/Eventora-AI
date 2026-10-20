import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export const AddIdeaModal = ({ isOpen, onClose, onAddIdea }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'theme',
    tag: 'Theme & Aesthetic',
    description: '',
    costImpact: 'Moderate',
  });

  const [errors, setErrors] = useState({});

  const typeMap = {
    theme: 'Theme & Aesthetic',
    decor: 'Decor & Floral',
    food: 'Food & Curated Menu',
    entertainment: 'Entertainment & Activities',
  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      type: val,
      tag: typeMap[val] || 'Custom Concept',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors({ title: 'Please provide a concept title' });
      return;
    }
    if (!formData.description.trim()) {
      setErrors({ description: 'Please describe the inspiration or execution details' });
      return;
    }

    onAddIdea(formData);
    setFormData({
      title: '',
      type: 'theme',
      tag: 'Theme & Aesthetic',
      description: '',
      costImpact: 'Moderate',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Custom Celebration Concept"
      subtitle="Save unique inspiration, table settings, or culinary ideas"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">
            Concept Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Floating Diya Lotus Waterway, Live Saffron Chai Bar"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full text-sm rounded-xl border px-3.5 py-2.5 bg-ivory/50 focus:bg-white focus:ring-1 focus:ring-sage-600 focus:outline-none transition-colors ${
              errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-stoneborder'
            }`}
          />
          {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Category
            </label>
            <select
              value={formData.type}
              onChange={handleTypeChange}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3.5 py-2.5 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            >
              <option value="theme">Themes & Aesthetic</option>
              <option value="decor">Decor & Floral Styling</option>
              <option value="food">Food & Curated Menu</option>
              <option value="entertainment">Entertainment & Music</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Cost Tier
            </label>
            <select
              value={formData.costImpact}
              onChange={(e) => setFormData({ ...formData, costImpact: e.target.value })}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3.5 py-2.5 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            >
              <option value="Budget-friendly">Budget-Conscious</option>
              <option value="Moderate">Moderate Investment</option>
              <option value="Premium">Signature Tier</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">
            Inspiration & Execution Details *
          </label>
          <textarea
            rows="3"
            placeholder="Describe styling colors, placement, materials, or guest experience details..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full text-sm rounded-xl border px-3.5 py-2 bg-ivory/50 focus:bg-white focus:ring-1 focus:ring-sage-600 focus:outline-none transition-colors resize-none ${
              errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-stoneborder'
            }`}
          />
          {errors.description && (
            <p className="text-xs text-rose-600 mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stoneborder">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Plus}>
            Save Concept
          </Button>
        </div>
      </form>
    </Modal>
  );
};
