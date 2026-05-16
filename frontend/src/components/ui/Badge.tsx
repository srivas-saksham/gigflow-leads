import type { Lead } from '../../types';

const statusConfig: Record<Lead['status'], { label: string; style: string }> = {
  new:       { label: 'New',       style: 'bg-[var(--blue-dim)] text-blue-400 border-[var(--blue-border)]' },
  contacted: { label: 'Contacted', style: 'bg-[var(--amber-dim)] text-amber-400 border-[var(--amber-border)]' },
  qualified: { label: 'Qualified', style: 'bg-[var(--green-dim)] text-green-400 border-[var(--green-border)]' },
  lost:      { label: 'Lost',      style: 'bg-[var(--red-dim)] text-red-400 border-[var(--red-border)]' },
};

const sourceConfig: Record<Lead['source'], { label: string; style: string }> = {
  website:   { label: 'Website',   style: 'bg-[#7c3aed]/10 text-purple-400 border-[#7c3aed]/20' },
  instagram: { label: 'Instagram', style: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  referral:  { label: 'Referral',  style: 'bg-[var(--amber-dim)] text-amber-400 border-[var(--amber-border)]' },
};

interface StatusBadgeProps { status: Lead['status'] }
interface SourceBadgeProps { source: Lead['source'] }

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border mono tracking-wide ${cfg.style}`}>
      <span className="w-1 h-1 rounded-full bg-current opacity-60" />
      {cfg.label}
    </span>
  );
};

export const SourceBadge = ({ source }: SourceBadgeProps) => {
  const cfg = sourceConfig[source];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border mono tracking-wide ${cfg.style}`}>
      {cfg.label}
    </span>
  );
};

interface RoleBadgeProps { role: 'admin' | 'sales' }
export const RoleBadge = ({ role }: RoleBadgeProps) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border mono tracking-widest uppercase ${
    role === 'admin'
      ? 'bg-[var(--amber-dim)] text-amber-400 border-[var(--amber-border)]'
      : 'bg-[var(--bg-raised)] text-[var(--text-muted)] border-[var(--border)]'
  }`}>
    {role}
  </span>
);