const stats = [
  { value: '3', label: 'Lead channels' },
  { value: '4', label: 'Pipeline stages' },
  { value: '2', label: 'Access roles' },
  { value: 'CSV', label: 'Export format' },
];

export const AboutSection = () => (
  <section id="about" style={{ borderTop: '1px solid var(--border)' }}>
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Copy */}
        <div>
          <p className="text-[10px] text-[var(--amber)] font-semibold tracking-[0.15em] uppercase mb-4">About</p>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-5 leading-snug">
            Built for teams that move fast
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
            GigFlow was built to solve a real problem: sales leads get lost.
            They sit in spreadsheets and email threads until someone follows up too late — or not at all.
          </p>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            This platform gives every person on the team exactly what they need.
            Sales users manage their leads. Admins see everything and export anytime.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-xl p-5"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
            >
              <p className="text-2xl font-bold text-[var(--text-primary)] mono mb-1">{value}</p>
              <p className="text-xs text-[var(--text-muted)]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);