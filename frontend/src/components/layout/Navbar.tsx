import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../ui/Badge';
import { ThemeToggle } from '../ui/ThemeToggle';
import { House, LogOut } from 'lucide-react';
import api from '../../utils/api';
import { useLeadStats } from '../../context/LeadStatsContext';

const useClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

const useOpenLeads = () => {
  const [count, setCount] = useState<number | null>(null);
  const { statsVersion } = useLeadStats();

  useEffect(() => {
    api
      .get('/api/leads?status=new&limit=1')
      .then((res) => setCount(res.data.pagination.total))
      .catch(() => setCount(null));
  }, [statsVersion]); // re-runs on every status change

  return count;
};

export const Navbar = () => {
  const { user, logout } = useAuth();
  const time = useClock();
  const openLeads = useOpenLeads();

  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'color-mix(in srgb, var(--bg-base) 85%, transparent)',
        backdropFilter: 'blur(12px)',
      }}
    >

      {/* ════════════════════════════════════
          DESKTOP — single row (md and above)
          ════════════════════════════════════ */}
      <div className="hidden md:flex items-center justify-between px-6 h-12">

        {/* Left — wordmark + back link */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-md bg-[var(--amber)] flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="3" fill="#080808" />
                <circle cx="5" cy="5" r="1" fill="#080808" />
              </svg>
            </span>
            <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">GigFlow</span>
          </div>

          <div className="w-px h-4 bg-[var(--border)]" />

          <Link
            to="/"
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ← Homepage
          </Link>
        </div>

        {/* Center — leads badge + clock */}
        <div className="flex items-center gap-4">
          {openLeads !== null && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'var(--amber-dim)', border: '1px solid var(--amber-border)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]" />
              <span className="text-[11px] font-medium text-[var(--amber)] mono">{openLeads} new</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-[var(--text-secondary)] mono">{timeStr}</span>
            <span className="text-[10px] text-[var(--text-muted)] mono">{dateStr}</span>
          </div>
        </div>

        {/* Right — theme toggle + user + sign out */}
        {user && (
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="w-px h-4 bg-[var(--border)]" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-secondary)]">{user.name}</span>
              <RoleBadge role={user.role} />
            </div>
            <div className="w-px h-4 bg-[var(--border)]" />
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-red-400 cursor-pointer transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
            
          </div>
        )}
      </div>

      {/* ════════════════════════════════════
          MOBILE — two rows (below md)
          ════════════════════════════════════ */}
      <div className="flex md:hidden flex-col">

        {/* Mobile Row 1 — branding + right actions */}
        <div className="flex items-center justify-between px-4 h-12">

          {/* Left — wordmark + homepage */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[var(--amber)] flex items-center justify-center shrink-0">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="3" fill="#080808" />
                  <circle cx="5" cy="5" r="1" fill="#080808" />
                </svg>
              </span>
              <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">GigFlow</span>
            </div>

            <div className="w-px h-4 bg-[var(--border)]" />

            <Link
              to="/"
              className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Back to homepage"
            >
              <House size={13} />
            </Link>
          </div>

          {/* Right — theme toggle + user + sign out */}
          {user && (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="w-px h-4 bg-[var(--border)]" />
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[var(--text-secondary)]">{user.name}</span>
                <RoleBadge role={user.role} compact />
              </div>
              <div className="w-px h-4 bg-[var(--border)]" />
              <button
                onClick={logout}
                className="flex items-center text-[var(--text-muted)] hover:text-red-400 cursor-pointer transition-colors"
                aria-label="Sign out"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Row 2 — leads badge + clock */}
        <div
          className="flex items-center justify-between px-4 py-2 gap-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {openLeads !== null ? (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'var(--amber-dim)', border: '1px solid var(--amber-border)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]" />
              <span className="text-[11px] font-medium text-[var(--amber)] mono">{openLeads} new leads</span>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--text-secondary)] mono">{timeStr}</span>
            <span
              className="text-[10px] text-[var(--text-muted)] mono px-1.5 py-0.5 rounded"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              {dateStr}
            </span>
          </div>
        </div>
      </div>

    </header>
  );
};