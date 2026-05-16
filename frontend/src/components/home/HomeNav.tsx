import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
};

export const HomeNav = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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
        background: 'rgba(8,8,8,0.9)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-[var(--amber)] flex items-center justify-center shrink-0">
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="3" fill="#080808"/>
              <circle cx="5" cy="5" r="1" fill="#080808"/>
            </svg>
          </span>
          <span className="text-sm font-semibold tracking-tight">GigFlow</span>
        </div>

        <div className="flex items-center gap-6">
          {['#about', '#how-it-works', '#contact'].map((href) => (
            <a
              key={href}
              href={href}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors capitalize"
            >
              {href.replace('#', '').replace('-', ' ')}
            </a>
          ))}
          <div className="w-px h-4 bg-[var(--border)]" />

          {/* Auth-aware right side */}
          {!user ? (
            // Not logged in — show Sign in button
            <Link
              to="/login"
              className="text-xs px-3 py-1.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg-base)] font-semibold hover:bg-white cursor-pointer transition-colors"
            >
              Sign in
            </Link>
          ) : user.role === 'customer' ? (
            // Customer — show avatar dropdown
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
                  {/* User info */}
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{user.email}</p>
                    <p className="text-xs mt-2" style={{ color: 'var(--amber)' }}>
                      You're logged in. New features coming soon.
                    </p>
                  </div>

                  {/* Sign out */}
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
            // Admin or Sales — show Dashboard link
            <Link
              to="/dashboard"
              className="text-xs px-3 py-1.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg-base)] font-semibold hover:bg-white cursor-pointer transition-colors"
            >
              Dashboard →
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};