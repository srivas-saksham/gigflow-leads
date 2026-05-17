// components/leads/detail/LeadDetailMeta.tsx
import type { Lead } from '../../../types';
import { UserIcon, ClockIcon, GlobeIcon } from './LeadDetailIcons';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

const formatRelative = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return 'Just now';
};

const statusMeta: Record<Lead['status'], { label: string; color: string; desc: string }> = {
  new:       { label: 'New',       color: '#60a5fa', desc: 'Freshly captured — not yet contacted.' },
  contacted: { label: 'Contacted', color: '#f59e0b', desc: 'Reached out at least once.' },
  qualified: { label: 'Qualified', color: '#4ade80', desc: 'Vetted and ready for conversion.' },
  lost:      { label: 'Lost',      color: '#f87171', desc: 'No longer pursuing this lead.' },
};

const sourceMeta: Record<Lead['source'], { label: string; detail: string }> = {
  website:  { label: 'Contact form', detail: 'Submitted via the public contact form. Message, interest, and team size were automatically ingested.' },
  instagram: { label: 'Instagram',   detail: 'Added manually following an Instagram outreach. Follow up via DM or move to email.' },
  referral:  { label: 'Referral',    detail: 'Referred by an existing contact. High-intent — prioritise with personalised outreach.' },
};

// ── Timeline dot ──────────────────────────────────────────────────
interface TimelineDotProps {
  icon: React.ReactNode;
  label: string;
  date: string;
  relative: string;
  accent?: boolean;
  last?: boolean;
}

const TimelineDot = ({ icon, label, date, relative, accent, last }: TimelineDotProps) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center" style={{ width: 24, flexShrink: 0 }}>
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: accent ? 'var(--amber-dim)' : 'var(--bg-raised)',
          border: `1px solid ${accent ? 'var(--amber-border)' : 'var(--border)'}`,
          color: accent ? 'var(--amber)' : 'var(--text-muted)',
        }}
      >
        {icon}
      </div>
      {!last && (
        <div
          style={{
            flex: 1, width: 1, minHeight: 16, marginTop: 3, marginBottom: 3,
            background: 'linear-gradient(to bottom, var(--border), transparent)',
          }}
        />
      )}
    </div>
    <div style={{ flex: 1, paddingBottom: last ? 0 : 14 }}>
      <p className="text-xs font-medium text-[var(--text-secondary)]">{label}</p>
      <p className="text-[10px] text-[var(--text-muted)] mono mt-0.5">{date} · {relative}</p>
    </div>
  </div>
);

// ── Section label ─────────────────────────────────────────────────
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)] pb-3 mb-3"
    style={{ borderBottom: '1px solid var(--border)' }}
  >
    {children}
  </p>
);

// ── Main export ───────────────────────────────────────────────────
interface Props {
  lead: Lead;
}

export const LeadDetailMeta = ({ lead }: Props) => {
  const sm = statusMeta[lead.status];
  const src = sourceMeta[lead.source] ?? { label: lead.source, detail: '' };
  const hasUpdate = lead.updatedAt && lead.updatedAt !== lead.createdAt;

  return (
    <div className="space-y-8">
      {/* ── Status ── */}
      <section>
        <SectionLabel>Pipeline status</SectionLabel>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: sm.color }}
          />
          <span className="text-sm font-semibold" style={{ color: sm.color }}>
            {sm.label}
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{sm.desc}</p>
      </section>

      {/* ── Timestamps ── */}
      <section>
        <SectionLabel>Timeline</SectionLabel>
        <TimelineDot
          icon={<UserIcon />}
          label="Lead created"
          date={`${formatDate(lead.createdAt)}, ${formatTime(lead.createdAt)}`}
          relative={formatRelative(lead.createdAt)}
          accent
          last={!hasUpdate}
        />
        {hasUpdate && (
          <TimelineDot
            icon={<ClockIcon />}
            label="Last updated"
            date={`${formatDate(lead.updatedAt)}, ${formatTime(lead.updatedAt)}`}
            relative={formatRelative(lead.updatedAt)}
            last
          />
        )}
      </section>

      {/* ── Source context ── */}
      <section>
        <SectionLabel>Source context</SectionLabel>
        <div className="flex items-center gap-2 mb-2">
          <GlobeIcon />
          <span className="text-xs font-semibold text-[var(--text-secondary)]">{src.label}</span>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{src.detail}</p>

        {lead.source === 'website' && (
          <div
            className="mt-3 px-3 py-2 rounded-lg text-[11px] mono inline-flex items-center gap-2"
            style={{
              background: 'var(--amber-dim)',
              border: '1px solid var(--amber-border)',
              color: 'var(--amber)',
            }}
          >
            <GlobeIcon />
            gigflow.vercel.app/#contact
          </div>
        )}
      </section>

    </div>
  );
};