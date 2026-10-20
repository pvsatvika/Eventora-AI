import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export const AddVendorModal = ({ isOpen, onClose, onAddVendor }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Catering',
    status: 'Researching',
    contactPerson: '',
    phone: '',
    email: '',
    estimatedCost: '',
    depositPaid: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'Venue & Hospitality',
    'Catering & Banquet',
    'Photography & Cinematography',
    'Floral & Decor Styling',
    'Music, Sound & DJ',
    'Attire & Makeup',
    'Stationery & Invitations',
    'Logistics & Transport',
    'AV Production & Staging',
    'Other Service',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrors({ name: 'Vendor / Company name is required' });
      return;
    }

    onAddVendor({
      ...formData,
      estimatedCost: Number(formData.estimatedCost) || 0,
      depositPaid: Number(formData.depositPaid) || 0,
    });

    setFormData({
      name: '',
      category: 'Catering & Banquet',
      status: 'Researching',
      contactPerson: '',
      phone: '',
      email: '',
      estimatedCost: '',
      depositPaid: '',
      notes: '',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Vendor Partner"
      subtitle="Track quotes, contacts, and contract commitments"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">
            Vendor / Company Name *
          </label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Royal Heritage Caterers, Aura Cinematics"
            value={formData.name}
            onChange={handleChange}
            className={`w-full text-sm rounded-xl border px-3.5 py-2.5 bg-ivory/50 focus:bg-white focus:ring-1 focus:ring-sage-600 focus:outline-none transition-colors ${
              errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-stoneborder'
            }`}
          />
          {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Service Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3.5 py-2.5 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Initial Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3.5 py-2.5 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            >
              <option value="Not Started">Not Started</option>
              <option value="Researching">Researching</option>
              <option value="Contacted">Contacted</option>
              <option value="Deposit Paid">Deposit Paid</option>
              <option value="Booked">Booked</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Point of Contact
            </label>
            <input
              type="text"
              name="contactPerson"
              placeholder="e.g. Ramesh K."
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3 py-2 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3 py-2 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="vendor@domain.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3 py-2 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Estimated Total Cost (₹)
            </label>
            <input
              type="number"
              name="estimatedCost"
              placeholder="100000"
              value={formData.estimatedCost}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3.5 py-2.5 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Deposit Paid in Advance (₹)
            </label>
            <input
              type="number"
              name="depositPaid"
              placeholder="25000"
              value={formData.depositPaid}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-3.5 py-2.5 focus:ring-1 focus:ring-sage-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1.5">
            Deliverables & Contract Terms
          </label>
          <textarea
            name="notes"
            rows="2"
            placeholder="e.g. Includes sound engineer, 4 wireless microphones, generator backup..."
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
            Save Vendor
          </Button>
        </div>
      </form>
    </Modal>
  );
};
