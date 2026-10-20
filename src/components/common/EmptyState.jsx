import React from 'react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
}) => {
  return (
    <div className="text-center py-12 px-6 rounded-2xl border border-dashed border-stoneborder bg-white/60 max-w-lg mx-auto">
      {Icon && (
        <div className="mx-auto w-11 h-11 rounded-xl bg-sage-50 text-sage-700 flex items-center justify-center mb-4 border border-sage-100">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h3 className="font-editorial text-lg text-charcoal font-medium">{title}</h3>
      <p className="text-sm text-muted mt-1.5 max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button
            onClick={onAction}
            icon={actionIcon}
            size="sm"
            variant="secondary"
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
