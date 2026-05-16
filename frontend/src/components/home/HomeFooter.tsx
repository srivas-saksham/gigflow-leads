import { Link } from 'react-router-dom';

export const HomeFooter = () => (
  <footer style={{ borderTop: '1px solid var(--border)' }}>
    <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
      <span className="text-xs text-[var(--text-muted)]">GigFlow</span>
      <span className="text-xs text-[var(--text-muted)]">Built for ServiceHive internship</span>
      <Link to="/login" className="text-xs text-[var(--text-muted)] hover:text-[var(--amber)] transition-colors">
        Staff login →
      </Link>
    </div>
  </footer>
);