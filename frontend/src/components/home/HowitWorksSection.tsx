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
    desc: 'Mark leads as qualified or lost. Export the full list to CSV anytime for reporting or handoff to another tool.',
  },
];

export const HowItWorksSection = () => (
  <section id="how-it-works" style={{ borderTop: '1px solid var(--border)' }}>
    <div className="max-w-5xl mx-auto px-6 py-20">
      <p className="text-[10px] text-[var(--amber)] font-semibold tracking-[0.15em] uppercase mb-4">How it works</p>
      <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-10 leading-snug">
        Three steps to a cleaner pipeline
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map(({ n, title, desc }) => (
          <div
            key={n}
            className="rounded-xl p-6 relative overflow-hidden"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
          >
            {/* Big bg number */}
            <span
              className="absolute top-2 right-4 text-7xl font-bold mono pointer-events-none select-none"
              style={{ color: 'var(--border)', lineHeight: 1 }}
            >
              {n}
            </span>
            <span className="text-xs font-semibold text-[var(--amber)] mono mb-3 block">{n}</span>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);