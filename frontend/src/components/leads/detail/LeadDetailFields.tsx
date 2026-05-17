// components/leads/detail/LeadDetailFields.tsx
// NOTE: Also update frontend/src/types/index.ts — add `notes?: string` to Lead interface
// NOTE: Also update backend/src/models/Lead.ts — notes field is already stored, just needed in ILead interface
import type { Lead } from '../../../types';
import { StatusBadge, SourceBadge } from '../../ui/Badge';
import {
  UserIcon, MailIcon, GlobeIcon, TagIcon,
  CalendarIcon, ClockIcon, IdIcon,
} from './LeadDetailIcons';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
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

// ── Parse the packed notes string from the contact form ───────────
// Format written by ContactSection: "Interests: X, Y | Team size: Z | Message: ..."
interface ParsedNotes {
  interests: string[];
  teamSize: string;
  message: string;
  raw: string;
}

const parseNotes = (notes: string): ParsedNotes | null => {
  if (!notes) return null;
  if (!notes.startsWith('Interests:')) {
    // Manually entered note — just show as raw
    return { interests: [], teamSize: '', message: notes, raw: notes };
  }
  const parts = notes.split(' | ');
  const get = (prefix: string) =>
    parts.find((p) => p.startsWith(prefix))?.slice(prefix.length).trim() ?? '';
  const interestRaw = get('Interests:');
  return {
    interests: interestRaw ? interestRaw.split(',').map((s) => s.trim()).filter(Boolean) : [],
    teamSize: get('Team size:'),
    message: get('Message:'),
    raw: notes,
  };
};

// ContactSection stores interest IDs — resolve to readable labels
const INTEREST_LABELS: Record<string, string> = {
  track:    'Track leads',
  team:     'Manage sales team',
  export:   'Export & reporting',
  pipeline: 'Pipeline visibility',
};
const resolveLabel = (s: string) => INTEREST_LABELS[s] ?? s;

// ── Field row ──────────────────────────────────────────────────────
interface FieldRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  last?: boolean;
}

const FieldRow = ({ icon, label, value, last }: FieldRowProps) => (
  <div
    className="flex items-start gap-4 py-3.5"
    style={!last ? { borderBottom: '1px solid var(--border)' } : undefined}
  >
    <span className="text-[var(--text-muted)] shrink-0 mt-0.5">{icon}</span>
    <span
      className="text-[10px] font-semibold tracking-widest uppercase text-[var(--text-muted)] shrink-0 mt-0.5"
      style={{ width: '90px' }}
    >
      {label}
    </span>
    <div className="flex-1 min-w-0 text-sm text-[var(--text-primary)]">{value}</div>
  </div>
);

// ── Submission context section (website leads with notes) ─────────
const SubmissionContext = ({ notes }: { notes: string }) => {
  const parsed = parseNotes(notes);
  if (!parsed) return null;

  const hasStructured = parsed.interests.length > 0 || !!parsed.teamSize;

  // Build rows dynamically so we know which is last
  const rows: FieldRowProps[] = [];

  if (parsed.interests.length > 0) {
    rows.push({
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
      label: 'Interests',
      value: (
        <div className="flex flex-wrap gap-1.5">
          {parsed.interests.map((s) => (
            <span
              key={s}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium mono"
              style={{
                background: 'var(--amber-dim)',
                border: '1px solid var(--amber-border)',
                color: 'var(--amber)',
              }}
            >
              {resolveLabel(s)}
            </span>
          ))}
        </div>
      ),
    });
  }

  if (parsed.teamSize) {
    rows.push({
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      label: 'Team size',
      value: (
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium mono"
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          {parsed.teamSize} people
        </span>
      ),
    });
  }

  if (parsed.message) {
    rows.push({
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
      label: 'Message',
      value: (
        <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
          {parsed.message}
        </p>
      ),
    });
  } else if (!hasStructured) {
    // Plain raw note (manually created lead)
    rows.push({
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
      label: 'Notes',
      value: (
        <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
          {parsed.raw}
        </p>
      ),
    });
  }

  if (rows.length === 0) return null;

  // Mark the last row
  rows[rows.length - 1] = { ...rows[rows.length - 1], last: true };

  return (
    <section className="mt-8">
      <p
        className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)] pb-3 mb-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        Form submission
      </p>
      {rows.map((r, i) => (
        <FieldRow key={i} {...r} />
      ))}
    </section>
  );
};

// ── Contact info section ───────────────────────────────────────────
interface Props {
  lead: Lead;
}

export const LeadDetailFields = ({ lead }: Props) => {
  const fields: FieldRowProps[] = [
    {
      icon: <UserIcon />,
      label: 'Name',
      value: <span className="font-medium">{lead.name}</span>,
    },
    {
      icon: <MailIcon />,
      label: 'Email',
      value: (
        <a
          href={`mailto:${lead.email}`}
          className="mono text-sm hover:text-[var(--amber)] transition-colors"
          style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
        >
          {lead.email}
        </a>
      ),
    },
    {
      icon: <TagIcon />,
      label: 'Status',
      value: <StatusBadge status={lead.status} />,
    },
    {
      icon: <GlobeIcon />,
      label: 'Source',
      value: <SourceBadge source={lead.source} />,
    },
    {
      icon: <CalendarIcon />,
      label: 'Created',
      value: (
        <div className="flex flex-col gap-0.5">
          <span className="mono text-sm text-[var(--text-primary)]">
            {formatDate(lead.createdAt)} · {formatTime(lead.createdAt)}
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">{formatRelative(lead.createdAt)}</span>
        </div>
      ),
    },
    {
      icon: <ClockIcon />,
      label: 'Updated',
      value: (
        <div className="flex flex-col gap-0.5">
          <span className="mono text-sm text-[var(--text-primary)]">
            {formatDate(lead.updatedAt)} · {formatTime(lead.updatedAt)}
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">{formatRelative(lead.updatedAt)}</span>
        </div>
      ),
    },
    {
      icon: <IdIcon />,
      label: 'Lead ID',
      value: (
        <span className="mono text-xs text-[var(--text-muted)] select-all break-all">
          {lead._id}
        </span>
      ),
      last: true,
    },
  ];

  return (
    <>
      <section>
        <p
          className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)] mb-1 pb-3"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          Contact details
        </p>
        {fields.map((f, i) => (
          <FieldRow key={i} {...f} />
        ))}
      </section>

      {lead.notes && <SubmissionContext notes={lead.notes} />}
    </>
  );
};