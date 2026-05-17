import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
};

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#contact', label: 'Contact' },
];

export const HomeNav = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const logoSrc ='/assets/logo-trans.png';

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  return (
    <nav
      className="sticky top-0 z-40"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'color-mix(in srgb, var(--bg-base) 90%, transparent)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* ── Row 1: Branding + Right actions ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-12 flex items-center justify-between">

        {/* Wordmark */}
        <div className="flex items-center gap-2">
          <img
            src={logoSrc}
            alt="GigFlow"
            draggable={false}
            className="w-6 h-6 rounded-md object-cover shrink-0"
          />
          <span className="text-md font-semibold tracking-tight text-[var(--text-primary)]">GigFlow</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right: theme toggle + auth */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block w-px h-4 bg-[var(--border)]" />
          <ThemeToggle />
          <div className="w-px h-4 bg-[var(--border)]" />

          {!user ? (
            <Link
              to="/login"
              className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors bg-[var(--text-primary)] text-[var(--bg-base)] hover:bg-white dark:hover:bg-[var(--amber)]"
            >
              Sign in
            </Link>
          ) : user.role === 'customer' ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all hover:ring-2 hover:ring-[var(--amber)]"
                style={{ background: 'var(--amber)', color: 'var(--bg-base)' }}
                aria-label="Account menu"
              >
                {getInitials(user.name)}
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-xl overflow-hidden"
                  style={{
                    background: 'var(--bg-overlay)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                  }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{user.email}</p>
                    <p className="text-xs mt-2" style={{ color: 'var(--amber)' }}>
                      You're logged in. New features coming soon.
                    </p>
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    className="w-full text-left px-4 py-2.5 text-xs text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--red-dim)] cursor-pointer transition-all"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors bg-[var(--text-primary)] text-[var(--bg-base)] hover:bg-white dark:hover:bg-[var(--amber)]"
            >
              Dashboard →
            </Link>
          )}
        </div>
      </div>

      {/* ── Row 2: Nav links — mobile only ── */}
      <div
        className="flex md:hidden items-center gap-2 px-4 py-2"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        {navLinks.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="flex-1 text-center text-[11px] font-medium px-2 py-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            style={{ border: '1px solid var(--border)' }}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
};