// pages/LeadDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { LeadModal } from '../components/leads/LeadModal';
import { LeadStatsProvider } from '../context/LeadStatsContext';
import { LeadDetailHeader } from '../components/leads/detail/LeadDetailHeader';
import { LeadDetailGlance } from '../components/leads/detail/LeadDetailGlance';
import { LeadDetailFields } from '../components/leads/detail/LeadDetailFields';
import { LeadDetailMeta } from '../components/leads/detail/LeadDetailMeta';
import { LeadDetailSkeleton } from '../components/leads/detail/LeadDetailSkeleton';
import type { Lead } from '../types';
import api from '../utils/api';

// ── Error state ────────────────────────────────────────────────────
const ErrorState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-32 text-center">
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
      style={{ background: 'var(--red-dim)', border: '1px solid var(--red-border)' }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <p className="text-sm font-medium text-[var(--text-primary)] mb-1">{message}</p>
    <Link to="/dashboard" className="text-xs text-[var(--amber)] hover:underline mt-2">
      Return to dashboard →
    </Link>
  </div>
);

// ── Inner page (consumes context) ─────────────────────────────────
const LeadDetailInner = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [lead, setLead]       = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchLead = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/leads/${id}`);
      setLead(res.data.lead);
    } catch {
      setError('Lead not found or you do not have access.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLead(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    if (!lead) return;
    if (!confirm(`Delete lead "${lead.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/api/leads/${lead._id}`);
      navigate('/dashboard');
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">

        {loading && <LeadDetailSkeleton />}

        {error && !loading && <ErrorState message={error} />}

        {lead && !loading && (
          <>
            {/* Header: breadcrumb + identity + actions */}
            <LeadDetailHeader
              lead={lead}
              deleting={deleting}
              isAdmin={isAdmin}
              onEdit={() => setEditOpen(true)}
              onDelete={handleDelete}
              onRefresh={fetchLead}
            />

            {/* At a glance — desktop only, single row */}
            <LeadDetailGlance lead={lead} />

            {/* Divider */}
            <div style={{ height: 1, background: 'var(--border)', marginBottom: '2rem' }} />

            {/* Two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
              {/* Left: contact details */}
              <div className="md:col-span-2">
                <LeadDetailFields lead={lead} />
              </div>

              {/* Right: meta, timeline, source context */}
              <div>
                <LeadDetailMeta lead={lead} />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Edit modal */}
      {lead && (
        <LeadModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          editLead={lead}
          onSuccess={() => {
            setEditOpen(false);
            fetchLead();
          }}
        />
      )}
    </div>
  );
};

// ── Page wrapper with providers ────────────────────────────────────
const LeadDetail = () => (
  <LeadStatsProvider>
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Navbar />
      <LeadDetailInner />
    </div>
  </LeadStatsProvider>
);

export default LeadDetail;