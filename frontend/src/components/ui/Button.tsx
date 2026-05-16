import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  children: ReactNode;
  loading?: boolean;
}

const variants = {
  primary:   'bg-[var(--text-primary)] text-[var(--bg-base)] font-semibold hover:bg-white active:scale-[0.98]',
  secondary: 'bg-transparent border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]',
  ghost:     'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)]',
  danger:    'bg-transparent border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--red-border)] hover:text-red-400 hover:bg-[var(--red-dim)]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
};

export const Button = ({
  variant = 'secondary',
  size = 'md',
  children,
  loading,
  disabled,
  className = '',
  ...props
}: ButtonProps) => (
  <button
    disabled={disabled || loading}
    className={`
      inline-flex items-center gap-2 cursor-pointer
      transition-all duration-150 whitespace-nowrap
      disabled:opacity-40 disabled:cursor-not-allowed
      ${variants[variant]} ${sizes[size]} ${className}
    `}
    {...props}
  >
    {loading && (
      <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
    )}
    {children}
  </button>
);