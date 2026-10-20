import React from 'react';

export const Badge = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
}) => {
  const variants = {
    primary: 'bg-sage-50 text-sage-800 border-sage-200/80',
    blush: 'bg-blush-100/70 text-charcoal border-blush-200',
    success: 'bg-[#F0F5F1] text-[#3D5A42] border-[#D1E0D3]',
    warning: 'bg-[#FBF6EE] text-[#8C6228] border-[#EEDCBA]',
    danger: 'bg-[#FDF3F3] text-[#8C2E2E] border-[#F5CBCB]',
    neutral: 'bg-ivory text-muted border-stoneborder',
  };

  const sizes = {
    xs: 'text-[11px] px-2 py-0.5 font-medium',
    sm: 'text-xs px-2.5 py-1 font-medium',
    md: 'text-sm px-3 py-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variants[variant] || variants.primary} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
};
