import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../ui/Badge';
import api from '../../utils/api';

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
  useEffect(() => {
    api
      .get('/api/leads?status=new&limit=1')
      .then((res) => setCount(res.data.pagination.total))
      .catch(() => setCount(null));
  }, []);
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
      className="sticky top-0 z-40 flex items-center justify-between px-6 h-12"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8, 8, 8, 0.56)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Left — wordmark + back link */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-md bg-[var(--amber)] flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="3" fill="#080808"/>
              <circle cx="5" cy="5" r="1" fill="#080808"/>
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

      {/* Center — stats + clock */}
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

      {/* Right — user info + sign out */}
      {user && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)]">{user.name}</span>
            <RoleBadge role={user.role} />
          </div>
          <div className="w-px h-4 bg-[var(--border)]" />
          <button
            onClick={logout}
            className="text-xs text-white/90 hover:text-red-400 cursor-pointer transition-colors px-1"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
};