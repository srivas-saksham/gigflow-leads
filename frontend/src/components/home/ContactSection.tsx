import { useState } from 'react';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import api from '../../utils/api';

type Status = 'idle' | 'loading' | 'success' | 'error';

export const ContactSection = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/api/leads/submit', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Copy */}
          <div>
            <p className="text-[10px] text-[var(--amber)] font-semibold tracking-[0.15em] uppercase mb-4">Contact</p>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-4 leading-snug">
              Interested in GigFlow?
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Fill in your details and our team will follow up. This form feeds directly into
              the lead dashboard — so you'll see exactly how it works from the other side.
            </p>
          </div>

          {/* Form */}
          <div>
            {status === 'success' ? (
              <div
                className="rounded-xl p-8 flex flex-col items-start gap-2"
                style={{ border: '1px solid var(--green-border)', background: 'var(--green-dim)' }}
              >
                <span className="text-green-400 text-sm font-semibold">Thanks for reaching out!</span>
                <span className="text-xs text-green-600">We'll be in touch soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <Alert variant="error" onDismiss={() => setStatus('idle')}>Something went wrong. Try again.</Alert>
                )}
                <Input label="Name" id="c-name" placeholder="Your name" value={form.name} onChange={set('name')} required />
                <Input label="Email" id="c-email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                <Textarea label="Message (optional)" id="c-msg" placeholder="Tell us what you're looking for..." rows={4} value={form.message} onChange={set('message')} />
                <Button type="submit" variant="primary" loading={status === 'loading'} className="w-full justify-center !mt-5">
                  Send message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};