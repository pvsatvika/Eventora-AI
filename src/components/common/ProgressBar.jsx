import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  color = 'bg-sage-600',
  height = 'h-2',
  showLabel = false,
  labelPrefix = '',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-muted mb-1.5 font-medium">
          <span>{labelPrefix}</span>
          <span className="text-charcoal font-semibold">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-sage-100/80 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${color} ${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
