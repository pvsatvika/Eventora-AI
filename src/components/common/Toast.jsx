import React, { useEffect } from 'react';
import { CheckCircle2, Info, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Toast = ({
  isOpen,
  message,
  type = 'success',
  actionLabel,
  actionPath,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 max-w-sm sm:max-w-md w-[calc(100%-2.5rem)] animate-slide-up"
    >
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FAF8F4] border border-stoneborder shadow-dropdown text-left text-charcoal">
        <div className="mt-0.5 shrink-0">
          {type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-sage-700" />
          ) : (
            <Info className="w-5 h-5 text-sage-800" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-charcoal leading-snug">
            {message}
          </p>
          {actionPath && (
            <Link
              to={actionPath}
              className="inline-flex items-center gap-1 text-xs font-semibold text-sage-800 hover:text-sage-900 mt-1 hover:underline"
            >
              <span>{actionLabel || 'View in Timeline'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-muted hover:text-charcoal hover:bg-white/80 transition-colors shrink-0"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
