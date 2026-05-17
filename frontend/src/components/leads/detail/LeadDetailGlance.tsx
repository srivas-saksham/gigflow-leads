// components/leads/detail/LeadDetailGlance.tsx
import type { Lead } from '../../../types';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
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

const statusLabel: Record<Lead['status'], { label: string; color: string }> = {
  new:       { label: 'New',       color: '#60a5fa' },
  contacted: { label: 'Contacted', color: '#f59e0b' },
  qualified: { label: 'Qualified', color: '#4ade80' },
  lost:      { label: 'Lost',      color: '#f87171' },
};

const sourceLabel: Record<Lead['source'], string> = {
  website:   'Contact form',
  instagram: 'Instagram',
  referral:  'Referral',
};

const Chip = ({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) => (
  <div className="flex flex-col gap-0.5">
    <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--text-muted)]">{label}</p>
    <p
      className="text-sm font-semibold mono"
      style={{ color: accent ?? 'var(--text-primary)' }}
    >
      {value}
    </p>
    {sub && <p className="text-[10px] text-[var(--text-muted)] mono">{sub}</p>}
  </div>
);

interface Props {
  lead: Lead;
}

export const LeadDetailGlance = ({ lead }: Props) => {
  const sm = statusLabel[lead.status];

  return (
    // hidden on mobile, flex row on md+
    <div
      className="hidden md:flex items-start gap-8 mb-6 pb-6"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <Chip
        label="Status"
        value={sm.label}
        accent={sm.color}
      />
      <Chip
        label="Source"
        value={sourceLabel[lead.source] ?? lead.source}
      />
      <Chip
        label="Created"
        value={formatRelative(lead.createdAt)}
        sub={formatDate(lead.createdAt)}
      />
      <Chip
        label="Updated"
        value={formatRelative(lead.updatedAt)}
        sub={formatDate(lead.updatedAt)}
      />
    </div>
  );
};