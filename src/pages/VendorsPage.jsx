import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Search,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { EventBanner } from '../components/layout/EventBanner';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { VendorCard } from '../components/vendors/VendorCard';
import { AddVendorModal } from '../components/vendors/AddVendorModal';
import { EmptyState } from '../components/common/EmptyState';
import { formatINR } from '../utils/currency';

export const VendorsPage = () => {
  const { activeEvent, updateVendor, addVendor, deleteVendor } = useEvents();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  if (!activeEvent) return null;

  const vendors = activeEvent.vendors || [];

  // Metrics
  const bookedVendors = vendors.filter(
    (v) => v.status === 'Booked' || v.status === 'Deposit Paid'
  );
  const totalVendorCost = vendors.reduce(
    (sum, v) => sum + (Number(v.estimatedCost) || 0),
    0
  );
  const totalDepositPaid = vendors.reduce(
    (sum, v) => sum + (Number(v.depositPaid) || 0),
    0
  );

  const categoriesList = Array.from(
    new Set(vendors.map((v) => v.category))
  ).filter(Boolean);

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.contactPerson &&
        v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (v.notes && v.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = filterCategory === 'all' || v.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleUpdateStatus = (vendorId, updates) => {
    updateVendor(activeEvent.id, vendorId, updates);
  };

  const handleDelete = (vendorId) => {
    deleteVendor(activeEvent.id, vendorId);
  };

  const handleAddVendor = (vendorData) => {
    addVendor(activeEvent.id, vendorData);
  };

  return (
    <div>
      <EventBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-left">
        {/* Header & Add Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl text-charcoal font-normal">
              Vendor Coordination & Checklist
            </h2>
            <p className="text-sm text-muted mt-1">
              Track supplier proposals, verified contacts, advance deposits, and contracts
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Vendor Partner
          </Button>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ivory border border-stoneborder text-xs text-muted">
          <span className="font-semibold text-charcoal">Guidance:</span>
          <span>AI-generated vendor entries represent suggested service categories and estimated cost targets. Specific partner details and contracts can be recorded as you negotiate real vendor quotes.</span>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-6">
            <span className="text-xs font-medium text-muted block mb-1">
              Vendor Team Locked
            </span>
            <div className="font-editorial text-2xl text-charcoal font-medium">
              {bookedVendors.length} of {vendors.length} Confirmed
            </div>
            <span className="text-xs text-muted block mt-2">
              {Math.round((bookedVendors.length / (vendors.length || 1)) * 100)}% of core vendor categories secured
            </span>
          </Card>

          <Card className="p-6">
            <span className="text-xs font-medium text-muted block mb-1">
              Committed Quotes (INR)
            </span>
            <div className="font-editorial text-2xl text-charcoal font-medium">
              {formatINR(totalVendorCost)}
            </div>
            <span className="text-xs text-muted block mt-2">
              Across all service disciplines
            </span>
          </Card>

          <Card className="p-6">
            <span className="text-xs font-medium text-muted block mb-1">
              Advance Deposits Paid
            </span>
            <div className="font-editorial text-2xl text-sage-800 font-medium">
              {formatINR(totalDepositPaid)}
            </div>
            <span className="text-xs text-muted block mt-2">
              Recorded tokens and booking advances
            </span>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stoneborder shadow-subtle">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vendor name, contact person, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-stoneborder focus:outline-none focus:ring-1 focus:ring-sage-600 bg-ivory/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs bg-white border border-stoneborder rounded-xl px-3 py-2 text-charcoal font-medium focus:outline-none focus:ring-1 focus:ring-sage-600 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categoriesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-white border border-stoneborder rounded-xl px-3 py-2 text-charcoal font-medium focus:outline-none focus:ring-1 focus:ring-sage-600 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="Deposit Paid">Deposit Paid</option>
              <option value="Contacted">Contacted</option>
              <option value="Researching">Researching</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>
        </div>

        {/* Vendors Grid */}
        {filteredVendors.length === 0 ? (
          <EmptyState
            icon={Users2}
            title="No vendors found"
            description="Add your first vendor quote or adjust your filter selection."
            actionLabel="Add Vendor Partner"
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Vendor Modal */}
      <AddVendorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddVendor={handleAddVendor}
      />
    </div>
  );
};
