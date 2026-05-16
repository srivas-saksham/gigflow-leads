import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../ui/Badge';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-6 h-12"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,8,8,0.92)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Wordmark */}
      <div className="flex items-center gap-2.5">
        <span className="w-5 h-5 rounded-md bg-[var(--amber)] flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="3" fill="#080808"/>
            <circle cx="5" cy="5" r="1" fill="#080808"/>
          </svg>
        </span>
        <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">GigFlow</span>
      </div>

      {/* Right */}
      {user && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)]">{user.email}</span>
            <RoleBadge role={user.role} />
          </div>
          <div className="w-px h-4 bg-[var(--border)]" />
          <button
            onClick={logout}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer transition-colors px-1"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
};