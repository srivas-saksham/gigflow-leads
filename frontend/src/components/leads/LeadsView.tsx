import { useState } from 'react';
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

const ExportIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

export const LeadsView = ({ isAdmin }: LeadsViewProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<LeadFilters>({ status: '', source: '', search: '', sortBy: 'latest', page: 1 });
  const debouncedSearch = useDebounce(searchInput, 400);
  const activeFilters = { ...filters, search: debouncedSearch };
  const { leads, pagination, loading, refetch } = useLeads(activeFilters);

  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);

  const openCreate = () => { setEditLead(null); setModalOpen(true); };
  const openEdit = (lead: Lead) => { setEditLead(lead); setModalOpen(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    try { await api.delete(`/api/leads/${id}`); refetch(); } catch { /* noop */ }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/api/leads/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = 'leads.csv'; a.click();
    } catch { /* noop */ }
  };

  const mergeFilter = (partial: Partial<LeadFilters>) =>
    setFilters((f) => ({ ...f, ...partial }));

  return (
    <>
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">Leads</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 mono">{pagination.total} total</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && (
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <ExportIcon /> Export CSV
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={openCreate}>
            <PlusIcon /> Add lead
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