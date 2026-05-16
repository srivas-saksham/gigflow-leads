import { useState } from 'react';
import api from '../../utils/api';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  interests: string[];
  companySize: string;
  name: string;
  email: string;
  message: string;
}

const INTERESTS = [
  { id: 'track', label: 'Track leads', icon: '⬡' },
  { id: 'team', label: 'Manage sales team', icon: '⬡' },
  { id: 'export', label: 'Export & reporting', icon: '⬡' },
  { id: 'pipeline', label: 'Pipeline visibility', icon: '⬡' },
];

const COMPANY_SIZES = ['Solo', '2–10', '10–50', '50+'];

const STEPS = ['What do you need?', 'About you', 'Send it'];

export const ContactSection = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    interests: [],
    companySize: '',
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');

  const toggleInterest = (id: string) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(id)
        ? f.interests.filter((i) => i !== id)
        : [...f.interests, id],
    }));
  };

  const canProceed = () => {
    if (step === 0) return form.interests.length > 0;
    if (step === 1) return form.companySize !== '';
    if (step === 2) return form.name.trim() !== '' && form.email.trim() !== '';
    return false;
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    setStatus('loading');
    try {
      const interestLabel = form.interests.join(', ');
      const notes = `Interests: ${interestLabel} | Team size: ${form.companySize}${form.message ? ` | Message: ${form.message}` : ''}`;
      await api.post('/api/leads/submit', {
        name: form.name,
        email: form.email,
        message: notes,
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <section id="contact" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-md mx-auto text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{
                background: 'var(--green-dim)',
                border: '1px solid var(--green-border)',
                animation: 'pulse-once 0.4s ease-out',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">You're in the pipeline.</h3>
            <p className="text-sm text-[var(--text-muted)]">
              Your interest has been logged in the GigFlow dashboard. We'll follow up at{' '}
              <span className="text-[var(--amber)]">{form.email}</span>.
            </p>
            {/* Fun little note */}
            <div
              className="mt-6 px-4 py-3 rounded-lg text-xs text-[var(--text-muted)] text-left"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <span className="text-[var(--amber)] font-semibold">Fun fact:</span> your submission just created a lead record in the GigFlow dashboard — that's the pipeline working in real time.
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Left copy */}
          <div className="md:pt-2">
            <p className="text-[10px] text-[var(--amber)] font-semibold tracking-[0.15em] uppercase mb-4">
              Get in touch
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-4 leading-snug">
              Interested in GigFlow?
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-5">
              Fill in a few details and we'll reach out.
            </p>

            {/* Lead gen callout */}
            <div
              className="rounded-xl p-4 mb-6 relative overflow-hidden"
              style={{
                background: 'var(--amber-dim)',
                border: '1px solid var(--amber-border)',
              }}
            >
              {/* Decorative dot grid */}
              <div
                className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, var(--amber) 1px, transparent 1px)',
                  backgroundSize: '8px 8px',
                }}
              />
              <div className="flex items-start gap-3 relative">
                <div>
                  <p className="text-xs font-semibold text-[var(--amber)] mb-1">
                    This is live lead generation
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Submitting this form creates a real lead record in the GigFlow dashboard — tracked, filterable, exportable. You're not just filling a form, you're testing the pipeline.
                  </p>
                </div>
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex flex-col gap-3">
              {STEPS.map((label, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold mono transition-all duration-300"
                    style={{
                      background: i < step
                        ? 'var(--amber)'
                        : i === step
                        ? 'var(--amber-dim)'
                        : 'var(--bg-surface)',
                      border: i === step
                        ? '1px solid var(--amber)'
                        : i < step
                        ? '1px solid var(--amber)'
                        : '1px solid var(--border)',
                      color: i < step
                        ? 'var(--bg-base)'
                        : i === step
                        ? 'var(--amber)'
                        : 'var(--text-muted)',
                      transform: i === step ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {i < step ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className="text-xs transition-colors duration-300"
                    style={{
                      color: i === step ? 'var(--text-primary)' : i < step ? 'var(--amber)' : 'var(--text-muted)',
                      fontWeight: i === step ? 500 : 400,
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right form card */}
          <div
            className="rounded-xl overflow-hidden transition-all duration-300"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              boxShadow: '0 0 0 0 transparent',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 transparent';
            }}
          >
            {/* Progress bar */}
            <div className="h-0.5" style={{ background: 'var(--bg-raised)' }}>
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: `${((step + 1) / STEPS.length) * 100}%`,
                  background: 'linear-gradient(90deg, var(--amber), #fbbf24)',
                }}
              />
            </div>

            <div className="p-6">
              {/* Step label */}
              <p className="text-[10px] font-semibold text-[var(--text-muted)] tracking-widest uppercase mb-1">
                Step {step + 1} of {STEPS.length}
              </p>
              <p className="text-sm font-semibold text-[var(--text-primary)] mb-5">
                {STEPS[step]}
              </p>

              {/* Step 0 — interests */}
              {step === 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {INTERESTS.map(({ id, label }) => {
                    const active = form.interests.includes(id);
                    return (
                      <button
                        key={id}
                        onClick={() => toggleInterest(id)}
                        className="rounded-lg px-4 py-3 text-sm text-left cursor-pointer transition-all duration-200"
                        style={{
                          border: active ? '1px solid var(--amber)' : '1px solid var(--border)',
                          background: active ? 'var(--amber-dim)' : 'var(--bg-raised)',
                          color: active ? 'var(--amber)' : 'var(--text-secondary)',
                          transform: active ? 'scale(1.02)' : 'scale(1)',
                          boxShadow: active ? '0 0 0 1px var(--amber-border)' : 'none',
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)';
                            (e.currentTarget as HTMLElement).style.background = 'var(--bg-overlay)';
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                            (e.currentTarget as HTMLElement).style.background = 'var(--bg-raised)';
                            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                          }
                        }}
                      >
                        <span className="block text-xs font-medium">{label}</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      const all = INTERESTS.map((i) => i.id);
                      const isAll = all.every((id) => form.interests.includes(id));
                      setForm((f) => ({ ...f, interests: isAll ? [] : all }));
                    }}
                    className="col-span-2 rounded-lg px-4 py-2.5 text-xs cursor-pointer transition-all duration-200"
                    style={{
                      border: '1px solid var(--border)',
                      background: 'transparent',
                      color: 'var(--text-muted)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                    }}
                  >
                    Select all
                  </button>
                </div>
              )}

              {/* Step 1 — company size */}
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-xs text-[var(--text-muted)] mb-4">How large is your team?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {COMPANY_SIZES.map((size) => {
                      const active = form.companySize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setForm((f) => ({ ...f, companySize: size }))}
                          className="rounded-lg px-4 py-4 text-sm font-medium cursor-pointer transition-all duration-200"
                          style={{
                            border: active ? '1px solid var(--amber)' : '1px solid var(--border)',
                            background: active ? 'var(--amber-dim)' : 'var(--bg-raised)',
                            color: active ? 'var(--amber)' : 'var(--text-secondary)',
                            transform: active ? 'scale(1.02)' : 'scale(1)',
                          }}
                          onMouseEnter={(e) => {
                            if (!active) {
                              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)';
                              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!active) {
                              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                            }
                          }}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2 — contact details */}
              {step === 2 && (
                <div className="space-y-4">
                  {status === 'error' && (
                    <div
                      className="px-3 py-2.5 rounded-lg text-xs"
                      style={{
                        background: 'var(--red-dim)',
                        border: '1px solid var(--red-border)',
                        color: '#f87171',
                      }}
                    >
                      Something went wrong. Please try again.
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                      Name <span style={{ color: 'var(--amber)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full rounded-lg px-3 py-2.5 text-sm transition-all duration-200"
                      style={{
                        background: 'var(--bg-raised)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--amber)';
                        e.target.style.boxShadow = '0 0 0 3px var(--amber-dim)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                      Email <span style={{ color: 'var(--amber)' }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full rounded-lg px-3 py-2.5 text-sm transition-all duration-200"
                      style={{
                        background: 'var(--bg-raised)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--amber)';
                        e.target.style.boxShadow = '0 0 0 3px var(--amber-dim)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                      Message{' '}
                      <span className="text-[var(--text-muted)] normal-case tracking-normal font-normal">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Anything specific you'd like us to know..."
                      rows={3}
                      className="w-full rounded-lg px-3 py-2.5 text-sm transition-all duration-200 resize-none"
                      style={{
                        background: 'var(--bg-raised)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--amber)';
                        e.target.style.boxShadow = '0 0 0 3px var(--amber-dim)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center gap-3 mt-6">
                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="px-4 py-2.5 rounded-lg text-sm cursor-pointer transition-all duration-200"
                    style={{
                      border: '1px solid var(--border)',
                      background: 'transparent',
                      color: 'var(--text-muted)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                    }}
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={() => {
                    if (!canProceed()) return;
                    if (step < STEPS.length - 1) {
                      setStep((s) => s + 1);
                    } else {
                      handleSubmit();
                    }
                  }}
                  disabled={!canProceed() || status === 'loading'}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: canProceed() ? 'var(--amber)' : 'var(--bg-raised)',
                    color: canProceed() ? 'var(--bg-base)' : 'var(--text-muted)',
                    border: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (canProceed() && status !== 'loading') {
                      (e.currentTarget as HTMLElement).style.background = '#fbbf24';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(245,158,11,0.35)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = canProceed() ? 'var(--amber)' : 'var(--bg-raised)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                  onMouseDown={(e) => {
                    if (canProceed()) {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(0.98)';
                    }
                  }}
                  onMouseUp={(e) => {
                    if (canProceed()) {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px) scale(1)';
                    }
                  }}
                >
                  {status === 'loading'
                    ? 'Sending...'
                    : step === STEPS.length - 1
                    ? 'Submit →'
                    : 'Continue →'}
                </button>
              </div>

              {/* Bottom micro-copy */}
              {step === 2 && (
                <p className="text-[10px] text-[var(--text-muted)] text-center mt-3">
                  Submitting creates a live lead in the dashboard — that's the whole point.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};