// Reusable button styles lifted from the marketing site.
// Pill (rounded-full) is the brand standard for CTAs.

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
}

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-5 py-2.5 text-[11px]',
  lg: 'px-7 py-4 text-xs',
};

const variantClasses: Record<'primary' | 'secondary' | 'ghost' | 'danger', string> = {
  primary: 'bg-primary text-black hover:bg-white',
  secondary:
    'bg-surface-container-high border border-white/10 text-on-surface hover:border-primary/50 hover:text-primary',
  ghost: 'text-on-surface-variant hover:text-primary',
  danger: 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20',
};

export function Button({
  variant = 'primary',
  size = 'md',
  pill = true,
  icon,
  iconRight,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 font-mono font-bold uppercase tracking-widest transition-all',
        pill ? 'rounded-full' : '',
        sizeClasses[size],
        variantClasses[variant],
        className,
      ].join(' ')}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">
      {children}
    </div>
  );
}

export function StatusPill({ dot = true, children }: { dot?: boolean; children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-primary/30 bg-primary/10 rounded-full">
      {dot && <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
      <span className="font-mono text-[11px] uppercase tracking-widest text-primary">{children}</span>
    </div>
  );
}

export function IconButton({
  label,
  children,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={[
        'inline-flex items-center justify-center w-9 h-9 rounded-full',
        'text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
