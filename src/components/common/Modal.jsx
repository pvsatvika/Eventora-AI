import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      // Auto-focus the dialog or first focusable element for screen-reader & keyboard users
      const timer = setTimeout(() => {
        if (dialogRef.current) {
          const firstFocusable = dialogRef.current.querySelector(
            'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
          );
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            dialogRef.current.focus();
          }
        }
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const titleId = title
    ? `modal-title-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
    : 'modal-title';
  const subtitleId = subtitle ? `${titleId}-subtitle` : undefined;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="presentation">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={subtitleId}
          className={`w-full ${maxWidth} transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-dropdown transition-all border border-stoneborder z-10 focus:outline-none`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-stoneborder px-6 py-5 bg-ivory/60">
            <div>
              <h3 id={titleId} className="font-editorial text-xl font-medium text-charcoal">
                {title}
              </h3>
              {subtitle && (
                <p id={subtitleId} className="text-xs text-muted mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-lg p-1.5 text-muted hover:bg-sage-100/60 hover:text-charcoal focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
};
