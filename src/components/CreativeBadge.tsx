import React from 'react';

interface CreativeBadgeProps {
  label: string;
  theme?: 'cyan' | 'gold' | 'terracotta' | 'slate' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  glow?: boolean;
  customIconId?: string;
}

/**
 * High-elegance typographic eyebrow component.
 * Completely free of symbols, icons, and bullet clutter.
 * Uses ultra-clean, wide-tracked luxury typography with jewel-tone gradients
 * and subtle glassmorphic illumination to keep visitors captivated.
 */
export const CreativeBadge: React.FC<CreativeBadgeProps> = ({
  label,
  theme = 'cyan',
  size = 'md',
  className = '',
  glow = false
}) => {
  const themeStyles = {
    cyan: {
      text: 'text-[#0891B2] bg-linear-to-r from-[#0891B2] via-[#0284C7] to-[#0891B2] bg-clip-text text-transparent',
      bg: 'bg-[#47C3D3]/10 hover:bg-[#47C3D3]/15',
      border: 'border-[#47C3D3]/40 hover:border-[#47C3D3]',
      glow: 'shadow-[0_2px_14px_rgba(71,195,211,0.25)]',
      accentBar: 'bg-[#47C3D3]'
    },
    gold: {
      text: 'text-[#B47818] bg-linear-to-r from-[#B47818] via-[#D6A348] to-[#925C13] bg-clip-text text-transparent',
      bg: 'bg-[#D6A348]/10 hover:bg-[#D6A348]/15',
      border: 'border-[#D6A348]/40 hover:border-[#D6A348]',
      glow: 'shadow-[0_2px_14px_rgba(214,163,72,0.25)]',
      accentBar: 'bg-[#D6A348]'
    },
    terracotta: {
      text: 'text-[#D67546] bg-linear-to-r from-[#D67546] via-[#EA580C] to-[#9A3412] bg-clip-text text-transparent',
      bg: 'bg-[#D67546]/10 hover:bg-[#D67546]/15',
      border: 'border-[#D67546]/40 hover:border-[#D67546]',
      glow: 'shadow-[0_2px_14px_rgba(214,117,70,0.25)]',
      accentBar: 'bg-[#D67546]'
    },
    slate: {
      text: 'text-slate-800 bg-linear-to-r from-[#2B3438] via-[#485358] to-[#1F272A] bg-clip-text text-transparent',
      bg: 'bg-[#485358]/10 hover:bg-[#485358]/15',
      border: 'border-[#485358]/35 hover:border-[#485358]/60',
      glow: 'shadow-[0_2px_12px_rgba(72,83,88,0.18)]',
      accentBar: 'bg-[#485358]'
    },
    neutral: {
      text: 'text-slate-700',
      bg: 'bg-slate-100 hover:bg-slate-200/70',
      border: 'border-slate-300 hover:border-slate-400',
      glow: 'shadow-xs',
      accentBar: 'bg-slate-400'
    }
  }[theme];

  const sizeStyles = {
    sm: 'text-[11px] py-1 px-3 tracking-[0.24em]',
    md: 'text-xs sm:text-[13px] py-1.5 px-4 tracking-[0.26em]',
    lg: 'text-sm sm:text-base py-2 px-5 tracking-[0.28em]'
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl border backdrop-blur-xs transition-all duration-300 select-none group cursor-default ${themeStyles.bg} ${themeStyles.border} ${glow ? themeStyles.glow : 'shadow-2xs'} ${className}`}
    >
      <span
        className={`font-black font-['Outfit'] uppercase ${sizeStyles} ${themeStyles.text} transition-transform duration-200 group-hover:scale-[1.01]`}
      >
        {label}
      </span>
    </div>
  );
};
