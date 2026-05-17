import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import api from '../../utils/api';
import { useLeadStats } from '../../context/LeadStatsContext';

const STATUSES: Lead['status'][] = ['new', 'contacted', 'qualified', 'lost'];

interface DropdownPos { top: number; left: number; width: number }

interface StatusDropdownProps {
  lead: Lead;
  onUpdated: () => void;
}

const StatusDropdown = ({ lead, onUpdated }: StatusDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState<DropdownPos>({ top: 0, left: 0, width: 130 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const { refreshStats } = useLeadStats();
  
  const calcPos = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.left, width: 130 });
  }, []);

  const handleOpen = () => { calcPos(); setOpen((o) => !o); };

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onScroll = () => setOpen(false);
    document.addEventListener('mousedown', close);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', close);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  const handleSelect = async (status: Lead['status']) => {
    if (status === lead.status) { setOpen(false); return; }
    setLoading(true);
    try {
      await api.put(`/api/leads/${lead._id}`, { status });
      onUpdated();
      refreshStats(); // ← triggers navbar refetch
    } catch { /* noop */ }
    finally { setLoading(false); setOpen(false); }
  };

  const dropdown = open ? createPortal(
    <div
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: pos.width,
        zIndex: 9999,
        background: 'var(--bg-overlay)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        paddingTop: '4px',
        paddingBottom: '4px',
      }}
    >
      {STATUSES.map((s) => (
        <button
          key={s}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => handleSelect(s)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            width: '100%', padding: '8px 12px', cursor: 'pointer',
            background: s === lead.status ? 'var(--amber-dim)' : 'transparent',
            border: 'none',
            color: s === lead.status ? 'var(--amber)' : 'var(--text-secondary)',
            fontSize: '12px', textAlign: 'left', transition: 'background 150ms',
          }}
          onMouseEnter={(e) => { if (s !== lead.status) (e.currentTarget as HTMLElement).style.background = 'var(--bg-raised)'; }}
          onMouseLeave={(e) => { if (s !== lead.status) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: s === 'new' ? '#60a5fa' : s === 'contacted' ? '#f59e0b' : s === 'qualified' ? '#4ade80' : '#f87171',
          }} />
          <span style={{ textTransform: 'capitalize' }}>{s}</span>
          {s === lead.status && (
            <svg style={{ marginLeft: 'auto' }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </button>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <div className="relative inline-flex items-center gap-1">
      <StatusBadge status={lead.status} />
      <button
        ref={btnRef}
        onClick={handleOpen}
        disabled={loading}
        className="flex items-center justify-center w-5 h-5 rounded text-[var(--text-muted)] hover:text-[var(--amber)] hover:bg-[var(--amber-dim)] cursor-pointer transition-all disabled:opacity-40"
      >
        {loading ? (
          <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}
      </button>
      {dropdown}
    </div>
  );
};

// ── Mobile lead card ──────────────────────────────────────────────
interface LeadCardProps {
  lead: Lead;
  isAdmin: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

const LeadCard = ({ lead, isAdmin, onEdit, onDelete, onRefresh }: LeadCardProps) => (
  <div
    className="rounded-xl p-4 transition-colors"
    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
  >
    {/* Top row: name + actions */}
    <div className="flex items-start justify-between gap-2 mb-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{lead.name}</p>
        <p className="text-[11px] text-[var(--text-muted)] mono truncate mt-0.5">{lead.email}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(lead)}
          className="px-2.5 py-1 rounded-md text-xs text-[var(--text-muted)] hover:text-[var(--amber)] hover:bg-[var(--amber-dim)] cursor-pointer transition-all"
        >
          Edit
        </button>
        {isAdmin && (
          <button
            onClick={() => onDelete(lead._id)}
            className="px-2.5 py-1 rounded-md text-xs text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--red-dim)] cursor-pointer transition-all"
          >
            Delete
          </button>
        )}
      </div>
    </div>

    {/* Bottom row: badges + date */}
    <div className="flex items-center gap-2 flex-wrap">
      <StatusDropdown lead={lead} onUpdated={onRefresh} />
      <SourceBadge source={lead.source} />
      <span className="text-[11px] text-[var(--text-muted)] mono ml-auto">
        {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="rounded-xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
    <div className="flex items-start justify-between mb-3">
      <div className="space-y-2 flex-1">
        <div className="h-3.5 w-32 rounded bg-[var(--bg-raised)] animate-pulse" />
        <div className="h-3 w-44 rounded bg-[var(--bg-raised)] animate-pulse" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-5 w-16 rounded bg-[var(--bg-raised)] animate-pulse" />
      <div className="h-5 w-14 rounded bg-[var(--bg-raised)] animate-pulse" />
    </div>
  </div>
);

const SkeletonRow = () => (
  <tr>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <td key={i} className="px-4 py-3.5">
        <div className="h-3 rounded-md bg-[var(--bg-raised)] animate-pulse" style={{ width: `${60 + i * 8}%` }} />
      </td>
    ))}
  </tr>
);

const Empty = ({ mobile }: { mobile?: boolean }) =>
  mobile ? (
    <div className="py-16 text-center">
      <p className="text-xs text-[var(--text-muted)] tracking-wide">No leads found</p>
    </div>
  ) : (
    <tr>
      <td colSpan={6} className="px-4 py-16 text-center">
        <p className="text-xs text-[var(--text-muted)] tracking-wide">No leads found</p>
      </td>
    </tr>
  );

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  isAdmin: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export const LeadsTable = ({ leads, loading, isAdmin, onEdit, onDelete, onRefresh }: LeadsTableProps) => (
  <>
    {/* ── Desktop table (md+) ── */}
    <div className="hidden md:block rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
              {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-[10px] font-semibold text-[var(--text-muted)] tracking-widest uppercase ${h === 'Actions' ? 'text-right' : 'text-left'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : leads.length === 0 ? (
              <Empty />
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="transition-colors duration-100"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{lead.name}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-[var(--text-muted)] mono">{lead.email}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusDropdown lead={lead} onUpdated={onRefresh} />
                  </td>
                  <td className="px-4 py-3.5">
                    <SourceBadge source={lead.source} />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-[var(--text-muted)] mono">
                      {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => onEdit(lead)}
                        className="px-2.5 py-1 rounded-md text-xs text-[var(--text-muted)] hover:text-[var(--amber)] hover:bg-[var(--amber-dim)] cursor-pointer transition-all"
                      >
                        Edit
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => onDelete(lead._id)}
                          className="px-2.5 py-1 rounded-md text-xs text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--red-dim)] cursor-pointer transition-all"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* ── Mobile card list (below md) ── */}
    <div className="flex md:hidden flex-col gap-2">
      {loading ? (
        Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
      ) : leads.length === 0 ? (
        <Empty mobile />
      ) : (
        leads.map((lead) => (
          <LeadCard
            key={lead._id}
            lead={lead}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
            onRefresh={onRefresh}
          />
        ))
      )}
    </div>
  </>
);