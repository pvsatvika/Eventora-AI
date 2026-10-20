import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none tracking-tight';

  const variants = {
    primary:
      'bg-sage-700 hover:bg-sage-800 text-white shadow-subtle hover:shadow-card focus:ring-sage-600',
    sage:
      'bg-sage-500 hover:bg-sage-600 text-white shadow-subtle hover:shadow-card focus:ring-sage-500',
    secondary:
      'bg-white hover:bg-sage-50 text-charcoal border border-stoneborder shadow-subtle hover:border-sage-300 focus:ring-sage-500',
    blush:
      'bg-blush-100 hover:bg-blush-200 text-charcoal border border-blush-200 focus:ring-blush-300',
    outline:
      'border border-stoneborder hover:border-sage-600 text-charcoal hover:text-sage-800 hover:bg-sage-50/50 bg-transparent focus:ring-sage-500',
    ghost:
      'text-charcoal hover:bg-sage-50 hover:text-sage-800 focus:ring-sage-500',
    danger:
      'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 focus:ring-rose-400',
    dark:
      'bg-charcoal hover:bg-black text-ivory shadow-subtle focus:ring-charcoal',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-[15px] px-5 py-2.5 gap-2.5 font-medium',
    xl: 'text-base px-6 py-3.5 gap-3 font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}

      <span>{children}</span>

      {!loading && Icon && iconPosition === 'right' ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
    </button>
  );
};
