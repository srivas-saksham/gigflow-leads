import { Link } from 'react-router-dom';

export const HeroSection = () => (
  <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 relative">
    {/* Subtle ambient */}
    <div
      className="absolute top-0 left-0 w-full h-80 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse 60% 40% at 20% 0%, rgba(245,158,11,0.05) 0%, transparent 70%)' }}
    />

    <div className="relative max-w-2xl">
      {/* Pill badge */}
      <div
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] text-[var(--text-muted)] mb-7"
        style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]" />
        Smart lead management for modern teams
      </div>

      <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-[var(--text-primary)] mb-5">
        Turn interest<br />
        <span style={{ color: 'var(--amber)' }}>into opportunity.</span>
      </h1>

      <p className="text-base text-[var(--text-muted)] leading-relaxed mb-8 max-w-lg">
        GigFlow gives sales teams one place to capture, track, and close leads.
        No noise. No spreadsheets. Just the pipeline.
      </p>

      <div className="flex items-center gap-3">
        <a
          href="#contact"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[var(--amber)] text-[var(--bg-base)] hover:brightness-110 cursor-pointer transition-all"
        >
          Get in touch
        </a>
        <Link
          to="/register"
          className="px-5 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
          style={{ border: '1px solid var(--border)' }}
        >
          Create account →
        </Link>
      </div>
    </div>
  </section>
);