import React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  pink: 'bg-[#FF2D78] text-white shadow-[0_0_20px_rgba(255,45,120,0.4)] hover:bg-[#FF6EC7] hover:shadow-[0_0_30px_rgba(255,45,120,0.6)]',
  blue: 'bg-[#00D4FF] text-[#0A0A0F] shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:bg-[#0080FF] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)]',
  purple: 'bg-[#2D1B69] text-white border border-[#FF2D78]/40 hover:bg-[#1A0533] hover:border-[#FF2D78]',
  ghost: 'bg-transparent text-[#FF6EC7] border border-[#FF2D78]/40 hover:bg-[#FF2D78]/10 hover:border-[#FF2D78]',
  danger: 'bg-red-600/80 text-white border border-red-400/30 hover:bg-red-700',
};

export default function NeonButton({
  children,
  onClick,
  variant = 'pink',
  className,
  disabled,
  type = 'button',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-6 py-3 rounded-xl font-black uppercase tracking-wide text-sm transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}