// components/leads/detail/LeadDetailHeader.tsx
import { Link } from 'react-router-dom';
import type { Lead } from '../../../types';
import { ArrowLeftIcon, RefreshIcon, EditIcon, TrashIcon } from './LeadDetailIcons';

const statusAccent: Record<Lead['status'], string> = {
  new:       '#60a5fa',
  contacted: '#f59e0b',
  qualified: '#4ade80',
  lost:      '#f87171',
};

interface Props {
  lead: Lead;
  deleting: boolean;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onRefresh: () => void;
}

export const LeadDetailHeader = ({ lead, deleting, isAdmin, onEdit, onDelete, onRefresh }: Props) => {
  const accent = statusAccent[lead.status];
  const initial = lead.name.charAt(0).toUpperCase();

  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--amber)] transition-colors"
        >
          <ArrowLeftIcon />
          Dashboard
        </Link>
        <span className="text-[var(--border)] text-xs">/</span>
        <span className="text-xs text-[var(--text-muted)]">Leads</span>
        <span className="text-[var(--border)] text-xs">/</span>
        <span className="text-xs text-[var(--text-secondary)] truncate max-w-[200px]">{lead.name}</span>
      </div>

      {/* Identity row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Monogram */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              background: `${accent}18`,
              border: `1px solid ${accent}30`,
              color: accent,
              fontFamily: "'Geist Mono', monospace",
            }}
          >
            {initial}
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)] tracking-tight leading-tight">
              {lead.name}
            </h1>
            <p className="text-xs text-[var(--text-muted)] mono mt-0.5">{lead.email}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefresh}
            title="Refresh"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--amber)] transition-all cursor-pointer"
            style={{ border: '1px solid var(--border)' }}
          >
            <RefreshIcon />
          </button>

          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all text-[var(--text-secondary)] hover:text-[var(--amber)]"
            style={{ border: '1px solid var(--border)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--amber)';
              (e.currentTarget as HTMLElement).style.background = 'var(--amber-dim)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <EditIcon /> Edit
          </button>

          {isAdmin && (
            <button
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all text-[var(--text-muted)] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ border: '1px solid var(--border)' }}
              onMouseEnter={e => {
                if (!deleting) {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--red-border)';
                  (e.currentTarget as HTMLElement).style.color = '#f87171';
                  (e.currentTarget as HTMLElement).style.background = 'var(--red-dim)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {deleting ? (
                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <TrashIcon />
              )}
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};