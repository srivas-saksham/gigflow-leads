import { Link } from 'react-router-dom';

const steps = [
  {
    n: '01',
    title: 'Lead comes in',
    desc: 'A visitor fills the contact form. Their info lands in the dashboard instantly — source tracked automatically as "website".',
  },
  {
    n: '02',
    title: 'Team takes over',
    desc: 'Sales users log in, update statuses, and work the pipeline. Admins see the full view with filters, search, and sort.',
  },
  {
    n: '03',
    title: 'Close and export',
    desc: 'Mark leads as qualified or lost. Export the full list to CSV anytime for reporting or handoff.',
  },
];

export const HeroSection = () => (
  <section className="relative overflow-hidden">
    {/* Amber radials */}
    <div
      className="absolute top-0 left-0 w-full h-96 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 55% 45% at 15% 5%, rgba(245,158,11,0.13) 0%, transparent 65%)',
      }}
    />
    <div
      className="absolute top-10 right-0 w-80 h-80 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 60% 60% at 85% 30%, rgba(245,158,11,0.06) 0%, transparent 70%)',
      }}
    />

    <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-16 items-start">

        {/* ── Left: Hero copy ── */}
        <div>
          {/* Pill badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] mb-7"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              color: 'var(--text-muted)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--amber)' }}
            />
            Smart lead management for modern sales teams
          </div>

          {/* Headline */}
          <h1
            className="text-4xl md:text-5xl font-bold leading-[1.08] tracking-tight mb-5"
            style={{ color: 'var(--text-primary)' }}
          >
            Turn interest
            <br />
            <span style={{ color: 'var(--amber)' }}>into opportunity.</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            GigFlow gives sales teams one place to capture, track, and close
            leads. No noise. No spreadsheets. Just the pipeline.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap mb-10">
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all bg-[var(--amber)] text-[var(--bg-base)] hover:bg-black dark:hover:bg-[var(--amber-selection)]"
            >
              Get in touch
            </a>

            <Link
              to="/register"
              className="px-5 py-2.5 rounded-lg text-sm transition-all border border-[var(--border)] text-[var(--text-secondary)] no-underline hover:border-[var(--amber)] hover:shadow-[0_0_0_2px_var(--amber-border),0_0_12px_var(--amber-dim)]"
            >
              Create account →
            </Link>

            <a
              href="#about"
              className="px-5 py-2.5 text-sm transition-colors text-[var(--text-muted)] no-underline hover:text-[var(--amber)]"
            >
              Read the brief ↓
            </a>
          </div>

          {/* Tech pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'TypeScript', note: 'end-to-end' },
              { label: 'MERN stack', note: 'full-stack' },
              { label: 'Role-based auth', note: 'JWT' },
              { label: 'Live on Vercel', note: 'deployed' },
            ].map(({ label, note }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px]"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--bg-surface)',
                }}
              >
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: 'var(--amber)', opacity: 0.6 }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ color: 'var(--text-muted)' }}>· {note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: How it works — vertical pipeline ── */}
        <div>
          {/* Header */}
          <div className="mb-6" id="how-it-works">
            <p
              className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-1"
              style={{ color: 'var(--amber)' }}
            >
              How it works
            </p>
            <p
              className="text-sm font-semibold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Three steps to a cleaner pipeline
            </p>
          </div>

          {/* Steps */}
          <div className="flex flex-col">
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} className="flex gap-4">

                {/* Timeline column */}
                <div className="flex flex-col items-center" style={{ width: '32px', flexShrink: 0 }}>
                  {/* Numbered circle */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold mono"
                    style={{
                      background: 'var(--amber-dim)',
                      border: '1px solid var(--amber-border)',
                      color: 'var(--amber)',
                      flexShrink: 0,
                    }}
                  >
                    {n}
                  </div>
                  {/* Connector line — skip on last */}
                  {i < steps.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        width: '1px',
                        marginTop: '6px',
                        marginBottom: '6px',
                        background: 'linear-gradient(to bottom, var(--amber-border), transparent)',
                        minHeight: '28px',
                      }}
                    />
                  )}
                </div>

                {/* Step card */}
                <div style={{ flex: 1, paddingBottom: i < steps.length - 1 ? '12px' : '0' }}>
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {title}
                    </p>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  </section>
);