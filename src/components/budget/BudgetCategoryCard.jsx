import React, { useState } from 'react';
import { Edit2, Check, X, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { formatINR } from '../../utils/currency';

export const BudgetCategoryCard = ({
  category,
  spent = 0,
  totalBudget = 1,
  onUpdateAllocated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [allocatedVal, setAllocatedVal] = useState(category.allocated);

  const allocated = Number(category.allocated) || 0;
  const remaining = allocated - spent;
  const percentOfTotal = Math.round((allocated / totalBudget) * 100) || 0;
  const isOverBudget = spent > allocated;

  const handleSave = () => {
    onUpdateAllocated(category.id, Number(allocatedVal));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setAllocatedVal(category.allocated);
    setIsEditing(false);
  };

  return (
    <Card className="p-6 flex flex-col justify-between text-left hover:border-sage-300 transition-all">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="font-editorial text-lg text-charcoal font-medium">
              {category.name}
            </h4>
            <span className="text-xs text-muted">
              {percentOfTotal}% of total celebration budget
            </span>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg text-muted hover:text-charcoal hover:bg-ivory transition-colors"
              title="Edit Allocated Amount"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handleSave}
                className="p-1 rounded-md bg-sage-100 text-sage-800 hover:bg-sage-200"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 rounded-md bg-stoneborder text-muted hover:bg-gray-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Planned Amount */}
        <div className="my-3.5">
          {isEditing ? (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-muted">₹</span>
              <input
                type="number"
                value={allocatedVal}
                onChange={(e) => setAllocatedVal(e.target.value)}
                className="w-full text-base font-semibold text-charcoal border border-sage-500 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-sage-600 focus:outline-none"
                autoFocus
              />
            </div>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="font-editorial text-2xl text-charcoal font-medium">
                {formatINR(allocated)}
              </span>
              <span className="text-xs text-muted">Planned</span>
            </div>
          )}
        </div>

        {/* Progress Bar & Balances */}
        <div className="space-y-1.5 mt-2">
          <ProgressBar
            value={spent}
            max={allocated || 1}
            color={isOverBudget ? 'bg-rose-600' : 'bg-sage-600'}
            height="h-1.5"
          />
          <div className="flex justify-between items-center text-xs pt-1">
            <span className="text-muted">
              Spent: <strong className="text-charcoal font-medium">{formatINR(spent)}</strong>
            </span>
            <span className={isOverBudget ? 'text-rose-700 font-medium' : 'text-sage-800 font-medium'}>
              {isOverBudget
                ? `Exceeded by ${formatINR(Math.abs(remaining))}`
                : `${formatINR(remaining)} remaining`}
            </span>
          </div>
        </div>
      </div>

      {isOverBudget && (
        <div className="mt-3.5 flex items-center gap-1.5 text-xs text-rose-800 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
          <span>Expenses exceed category allocation</span>
        </div>
      )}
    </Card>
  );
};
