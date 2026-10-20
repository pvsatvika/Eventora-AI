import React from 'react';
import {
  Phone,
  Mail,
  User,
  Trash2,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatINR } from '../../utils/currency';

export const VendorCard = ({ vendor, onUpdateStatus, onDelete }) => {
  const statusConfig = {
    'Booked': { variant: 'success', label: 'Booked' },
    'Deposit Paid': { variant: 'primary', label: 'Deposit Paid' },
    'Contacted': { variant: 'blush', label: 'Contacted' },
    'Researching': { variant: 'warning', label: 'Researching' },
    'Not Started': { variant: 'neutral', label: 'Not Started' },
  };

  const statusOptions = [
    'Not Started',
    'Researching',
    'Contacted',
    'Deposit Paid',
    'Booked',
  ];

  return (
    <Card className="p-6 flex flex-col justify-between text-left hover:border-sage-300 transition-all">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-sage-800 bg-sage-50 px-2.5 py-0.5 rounded-md border border-sage-200/60">
                {vendor.category}
              </span>
              <span className="text-[10px] text-muted font-medium bg-ivory px-2 py-0.5 rounded border border-stoneborder">
                Suggested Category
              </span>
            </div>
            <h3 className="font-editorial text-lg text-charcoal font-medium mt-2">
              {vendor.name}
            </h3>
          </div>

          <button
            onClick={() => onDelete(vendor.id)}
            className="text-muted hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            title="Delete vendor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5 text-xs text-muted mb-4 border-y border-stoneborder py-3">
          {vendor.contactPerson && (
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-muted" />
              <span className="text-charcoal font-medium">{vendor.contactPerson}</span>
            </div>
          )}
          {vendor.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-muted" />
              <a
                href={`tel:${vendor.phone}`}
                className="hover:text-charcoal transition-colors"
              >
                {vendor.phone}
              </a>
            </div>
          )}
          {vendor.email && (
            <div className="flex items-center gap-2 truncate">
              <Mail className="w-3.5 h-3.5 text-muted" />
              <a
                href={`mailto:${vendor.email}`}
                className="hover:text-charcoal transition-colors truncate"
              >
                {vendor.email}
              </a>
            </div>
          )}
        </div>

        {/* Notes */}
        {vendor.notes && (
          <p className="text-xs text-muted italic mb-4 bg-ivory p-3 rounded-xl border border-stoneborder">
            "{vendor.notes}"
          </p>
        )}

        {/* Cost & Deposit in INR */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-ivory mb-4 text-xs border border-stoneborder">
          <div>
            <span className="text-muted block text-[11px]">Estimated Quote (Est.)</span>
            <span className="font-editorial text-base text-charcoal font-medium mt-0.5 block">
              {formatINR(vendor.estimatedCost)}
            </span>
          </div>
          <div>
            <span className="text-muted block text-[11px]">Deposit Handed Over</span>
            <span className="font-editorial text-base text-sage-800 font-medium mt-0.5 block">
              {formatINR(vendor.depositPaid)}
            </span>
          </div>
        </div>
      </div>

      {/* Status Selector */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-stoneborder">
        <label className="text-xs text-muted">Booking Status:</label>
        <select
          value={vendor.status}
          onChange={(e) => onUpdateStatus(vendor.id, { status: e.target.value })}
          className="text-xs font-medium rounded-lg border border-stoneborder bg-white px-2.5 py-1 text-charcoal focus:ring-1 focus:ring-sage-600 focus:outline-none cursor-pointer"
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </Card>
  );
};
