import { useState, useRef, useEffect } from 'react';
import { useLeads } from '../../hooks/useLeads';
import { useDebounce } from '../../hooks/useDebounce';
import { LeadFiltersBar } from './LeadFiltersBar';
import { LeadsTable } from './LeadsTable';
import { LeadModal } from './LeadModal';
import { PaginationBar } from '../ui/Pagination';
import { Button } from '../ui/Button';
import type { Lead, LeadFilters } from '../../types';
import api from '../../utils/api';

interface LeadsViewProps { isAdmin: boolean }

const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const XIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const DEFAULT_FILTERS: LeadFilters = { status: '', source: '', search: '', sortBy: 'latest', page: 1 };

// Build human-readable label for active filters
const getActiveFilterLabels = (filters: LeadFilters, search: string) => {
  const labels: { key: string; label: string }[] = [];
  if (search) labels.push({ key: 'search', label: `"${search}"` });
  if (filters.status) labels.push({ key: 'status', label: filters.status });
  if (filters.source) labels.push({ key: 'source', label: filters.source });
  return labels;
};

export const LeadsView = ({ isAdmin }: LeadsViewProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const debouncedSearch = useDebounce(searchInput, 400);
  const activeFilters = { ...filters, search: debouncedSearch };
  const { leads, pagination, loading, refetch } = useLeads(activeFilters);

  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const openCreate = () => { setEditLead(null); setModalOpen(true); };
  const openEdit = (lead: Lead) => { setEditLead(lead); setModalOpen(true); };

  const mergeFilter = (partial: Partial<LeadFilters>) =>
    setFilters((f) => ({ ...f, ...partial }));

  const clearAllFilters = () => {
    setSearchInput('');
    setFilters(DEFAULT_FILTERS);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    try { await api.delete(`/api/leads/${id}`); refetch(); } catch { /* noop */ }
  };

  // Close export dropdown on outside click
  useEffect(() => {
    if (!exportOpen) return;
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [exportOpen]);

  const doExport = async (withFilters: boolean) => {
    setExporting(true);
    setExportOpen(false);
    try {
      const params = new URLSearchParams();
      if (withFilters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.source) params.append('source', filters.source);
        if (debouncedSearch) params.append('search', debouncedSearch);
      }
      const res = await api.get(`/api/leads/export?${params.toString()}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = withFilters && activeFilterLabels.length > 0 ? 'leads-filtered.csv' : 'leads.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch { /* noop */ } finally {
      setExporting(false);
    }
  };

  const activeFilterLabels = getActiveFilterLabels(filters, debouncedSearch);
  const hasActiveFilters = activeFilterLabels.length > 0;

  return (
    <>
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">Leads</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 mono">{pagination.total} total</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Export button — admin only */}
          {isAdmin && (
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => {
                  if (!hasActiveFilters) {
                    // No filters — export directly, no dropdown needed
                    doExport(false);
                  } else {
                    setExportOpen((o) => !o);
                  }
                }}
                disabled={exporting}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-md cursor-pointer transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  border: hasActiveFilters
                    ? '1px solid var(--amber-border)'
                    : '1px solid var(--border)',
                  background: hasActiveFilters ? 'var(--amber-dim)' : 'transparent',
                  color: hasActiveFilters ? 'var(--amber)' : 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  if (!exporting) {
                    (e.currentTarget as HTMLElement).style.borderColor = hasActiveFilters
                      ? 'var(--amber)'
                      : 'var(--border-hover)';
                    (e.currentTarget as HTMLElement).style.color = hasActiveFilters
                      ? 'var(--amber)'
                      : 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = hasActiveFilters
                    ? 'var(--amber-border)'
                    : 'var(--border)';
                  (e.currentTarget as HTMLElement).style.color = hasActiveFilters
                    ? 'var(--amber)'
                    : 'var(--text-secondary)';
                }}
              >
                {exporting ? (
                  <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                ) : (
                  <DownloadIcon />
                )}
                Export CSV
                {/* Filter count badge */}
                {hasActiveFilters && (
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold mono"
                    style={{
                      background: 'var(--amber)',
                      color: 'var(--bg-base)',
                      lineHeight: 1,
                    }}
                  >
                    <FilterIcon />
                    {activeFilterLabels.length}
                  </span>
                )}
                {/* Chevron when filters active */}
                {hasActiveFilters && (
                  <svg
                    width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    style={{
                      transform: exportOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease',
                    }}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                )}
              </button>

              {/* Dropdown — only shown when filters are active */}
              {exportOpen && hasActiveFilters && (
                <div
                  className="absolute right-0 mt-2 rounded-xl overflow-hidden z-50"
                  style={{
                    width: '260px',
                    background: 'var(--bg-overlay)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}
                >
                  {/* Active filters preview */}
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--text-muted)] mb-2">
                      Active filters
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeFilterLabels.map(({ key, label }) => (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] mono"
                          style={{
                            background: 'var(--amber-dim)',
                            border: '1px solid var(--amber-border)',
                            color: 'var(--amber)',
                          }}
                        >
                          <FilterIcon />
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Export with filters */}
                  <button
                    onClick={() => doExport(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs text-left cursor-pointer transition-colors"
                    style={{ color: 'var(--text-primary)', background: 'transparent' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-raised)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: 'var(--amber-dim)', color: 'var(--amber)' }}
                    >
                      <DownloadIcon />
                    </span>
                    <div>
                      <p className="font-medium">Export filtered results</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                        {pagination.total} lead{pagination.total !== 1 ? 's' : ''} match current filters
                      </p>
                    </div>
                  </button>

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid var(--border)' }} />

                  {/* Clear filters + export all */}
                  <button
                    onClick={() => {
                      clearAllFilters();
                      doExport(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs text-left cursor-pointer transition-colors"
                    style={{ color: 'var(--text-secondary)', background: 'transparent' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-raised)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: 'var(--bg-raised)', color: 'var(--text-muted)' }}
                    >
                      <XIcon />
                    </span>
                    <div>
                      <p className="font-medium">Clear filters &amp; export all</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                        Removes active filters and downloads everything
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          <Button variant="primary" size="sm" onClick={openCreate}>
            <PlusIcon /> Add Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <LeadFiltersBar
          searchInput={searchInput}
          onSearchChange={(v) => { setSearchInput(v); mergeFilter({ page: 1 }); }}
          filters={filters}
          onFilterChange={mergeFilter}
        />
      </div>

      {/* Table */}
      <LeadsTable
        leads={leads}
        loading={loading}
        isAdmin={isAdmin}
        onEdit={openEdit}
        onDelete={handleDelete}
        onRefresh={refetch}
      />

      {/* Pagination */}
      <PaginationBar
        pagination={pagination}
        page={filters.page}
        onPageChange={(p) => mergeFilter({ page: p })}
      />

      {/* Modal */}
      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editLead={editLead}
        onSuccess={refetch}
      />
    </>
  );
};