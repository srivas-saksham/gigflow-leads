import { Link } from 'react-router-dom';

export const HomeNav = () => (
  <nav
    className="sticky top-0 z-40"
    style={{
      borderBottom: '1px solid var(--border)',
      background: 'rgba(8,8,8,0.9)',
      backdropFilter: 'blur(12px)',
    }}
  >
    <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
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
        <Link
          to="/login"
          className="text-xs px-3 py-1.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg-base)] font-semibold hover:bg-white cursor-pointer transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  </nav>
);