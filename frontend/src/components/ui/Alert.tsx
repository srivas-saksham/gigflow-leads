import type { ReactNode } from 'react';

interface AlertProps {
  variant: 'error' | 'success' | 'info';
  children: ReactNode;
  onDismiss?: () => void;
}

const styles = {
  error:   'bg-[var(--red-dim)] border-[var(--red-border)] text-red-400',
  success: 'bg-[var(--green-dim)] border-[var(--green-border)] text-green-400',
  info:    'bg-[var(--amber-dim)] border-[var(--amber-border)] text-amber-400',
};

export const Alert = ({ variant, children, onDismiss }: AlertProps) => (
  <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm ${styles[variant]}`}>
    <span className="flex-1">{children}</span>
    {onDismiss && (
      <button onClick={onDismiss} className="opacity-60 hover:opacity-100 cursor-pointer shrink-0 mt-0.5" aria-label="Dismiss">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    )}
  </div>
);