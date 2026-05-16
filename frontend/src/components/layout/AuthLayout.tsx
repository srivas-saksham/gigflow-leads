import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => (
  <div
    className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
    style={{ background: 'var(--bg-base)' }}
  >
    {/* Ambient glow */}
    <div
      className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-64 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at center top, rgba(245,158,11,0.06) 0%, transparent 70%)' }}
    />

    <div className="w-full max-w-sm relative">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <span className="w-6 h-6 rounded-md bg-[var(--amber)] flex items-center justify-center shrink-0">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="3" fill="#080808"/>
            <circle cx="5" cy="5" r="1" fill="#080808"/>
          </svg>
        </span>
        <span className="text-base font-semibold tracking-tight">GigFlow</span>
      </div>

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">{title}</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">{subtitle}</p>
      </div>

      {/* Card */}
      <div
        className="rounded-xl p-6 space-y-4"
        style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
      >
        {children}
      </div>

      {/* Footer */}
      {footer && <div className="mt-5 text-center">{footer}</div>}
    </div>
  </div>
);