const techStack = [
  { category: 'Frontend', items: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'React Router v7', 'Axios'] },
  { category: 'Backend', items: ['Node.js', 'Express.js', 'TypeScript', 'Mongoose', 'JWT Auth', 'bcryptjs'] },
  { category: 'Database', items: ['MongoDB Atlas', 'Mongoose ODM', 'Atlas Free Tier', 'Mumbai region'] },
  { category: 'Infrastructure', items: ['Render (API)', 'Vercel (UI)', 'Docker', 'docker-compose', 'UptimeRobot'] },
];

const features = [
  'JWT-based auth with bcrypt password hashing',
  'Role-based access control — Admin vs Sales User',
  'Full leads CRUD with server-side pagination',
  'Debounced search + multi-filter (status, source, sort)',
  'CSV export endpoint (admin only)',
  'Public lead capture form — auto-ingests to dashboard',
  'Reusable TypeScript component library',
  'Clean RESTful API with centralized error handling',
];

export const AboutSection = () => (
  <section
    id="about"
    className="rounded-tl-4xl rounded-tr-4xl"
    style={{ background: '#f59e0b', marginTop: '0' }}
  >
    {/* Subtle radial on amber */}
    <div
      className="relative"
      style={{
        background: 'radial-gradient(ellipse 70% 50% at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 60%)',
        borderRadius: 'inherit',
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-20">

        {/* Section label */}
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: 'rgba(0,0,0,0.45)' }}>
          About this project
        </p>

        {/* Headline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">
          <div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight mb-5" style={{ color: '#0f0700' }}>
              What I built,<br />and why it matters.
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(0,0,0,0.65)' }}>
              This is <strong style={{ color: '#0f0700' }}>GigFlow</strong> — a Smart Leads Dashboard built as a full-stack internship assignment for <strong style={{ color: '#0f0700' }}>ServiceHive</strong>. The brief asked for a production-grade MERN application covering auth, CRUD, filtering, pagination, role-based access, CSV export, and Docker setup.
            </p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(0,0,0,0.65)' }}>
              I went beyond the spec. Instead of just a dashboard, I built a full product experience — a public landing page that captures leads automatically into the pipeline, a multi-step interest form, a team management panel for admins, and an inline status editor in the leads table. All typed end-to-end in TypeScript.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(0,0,0,0.65)' }}>
              The goal wasn't just to pass the evaluation. It was to build something I'd be proud to show any company — as evidence of how I think about product, architecture, and code quality together.
            </p>
          </div>

          {/* PDF assignment card */}
          <div className="flex flex-col gap-4">
            {/* PDF card */}
            <a
              href="/assets/assignment.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden transition-all hover:scale-[1.01]"
              style={{
                background: 'rgba(0,0,0,0.07)',
                border: '1px solid rgba(0,0,0,0.12)',
                textDecoration: 'none',
              }}
            >
              {/* PDF thumbnail preview */}
              <div
                className="relative w-full flex items-center justify-center"
                style={{
                  height: '160px',
                  background: 'rgba(0,0,0,0.1)',
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
                }}
              >
                {/* Fake doc lines for visual flair */}
                <div className="flex flex-col items-center gap-1 w-20 opacity-50">
                  <div className="w-full h-1.5 rounded-sm" style={{ background: 'rgba(0,0,0,0.25)' }} />
                  <div className="w-4/5 h-1.5 rounded-sm" style={{ background: 'rgba(0,0,0,0.18)' }} />
                  <div className="w-full h-1.5 rounded-sm" style={{ background: 'rgba(0,0,0,0.18)' }} />
                  <div className="w-3/4 h-1.5 rounded-sm" style={{ background: 'rgba(0,0,0,0.14)' }} />
                  <div className="w-full h-1.5 rounded-sm" style={{ background: 'rgba(0,0,0,0.14)' }} />
                  <div className="w-4/5 h-1.5 rounded-sm" style={{ background: 'rgba(0,0,0,0.10)' }} />
                </div>
                {/* PDF badge */}
                <div
                  className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider mono"
                  style={{ background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.85)' }}
                >
                  PDF
                </div>
                {/* View icon overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.3)' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </div>
              </div>

              {/* Card footer */}
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#0f0700' }}>
                    Full Stack Intern Assignment.pdf
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>
                    Original brief from ServiceHive · GigFlow
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </div>
            </a>

            {/* Caption */}
            <p className="text-[11px] leading-relaxed text-center" style={{ color: 'rgba(0,0,0,0.45)' }}>
              Assignment brief issued by ServiceHive · Built in 48 hours from requirements to deployed product.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-12" style={{ borderTop: '1px solid rgba(0,0,0,0.12)' }} />

        {/* Technical breakdown */}
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-6" style={{ color: 'rgba(0,0,0,0.45)' }}>
          Technical breakdown
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {techStack.map(({ category, items }) => (
            <div
              key={category}
              className="rounded-xl p-4"
              style={{ background: 'rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.1)' }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(0,0,0,0.4)' }}>
                {category}
              </p>
              <div className="flex flex-col gap-1.5">
                {items.map((item) => (
                  <span key={item} className="text-xs font-medium mono" style={{ color: '#0f0700' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Features list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2.5">
          {features.map((f) => (
            <div key={f} className="flex items-start gap-2.5">
              <svg
                className="shrink-0 mt-0.5"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.65)' }}>
                {f}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom attribution */}
        <div
          className="mt-14 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(0,0,0,0.12)' }}
        >
          <div>
            <p className="text-xs font-semibold" style={{ color: '#0f0700' }}>
              Saksham Srivastava · Full Stack Developer
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(0,0,0,0.45)' }}>
              Internship candidate · ServiceHive Full Stack Development Program · May 2026
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/srivas-saksham/gigflow-leads"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-black/10"
              style={{
                border: '1px solid rgba(0,0,0,0.2)',
                color: '#0f0700',
                textDecoration: 'none',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>

      </div>
    </div>
  </section>
);