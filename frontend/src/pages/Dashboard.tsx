import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLeads } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import type { Lead, LeadFilters } from '../types';
import api from '../utils/api';

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  contacted: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  qualified: 'bg-green-500/10 text-green-400 border-green-500/20',
  lost: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const sourceColors: Record<string, string> = {
  website: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  instagram: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  referral: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

const emptyForm = {
  name: '',
  email: '',
  status: 'new' as Lead['status'],
  source: 'website' as Lead['source'],
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<LeadFilters>({
    status: '',
    source: '',
    search: '',
    sortBy: 'latest',
    page: 1,
  });

  const debouncedSearch = useDebounce(searchInput, 400);

  const activeFilters = {
    ...filters,
    search: debouncedSearch,
  };

const { leads, pagination, loading, refetch } = useLeads(activeFilters);

  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const openCreate = () => {
    setEditLead(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (lead: Lead) => {
    setEditLead(lead);
    setForm({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
    setSubmitting(true);
    try {
      if (editLead) {
        await api.put(`/api/leads/${editLead._id}`, form);
      } else {
        await api.post('/api/leads', form);
      }
      setShowModal(false);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await api.delete(`/api/leads/${id}`);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/api/leads/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.csv';
      a.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        <h1 className="text-lg font-semibold">GigFlow</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {user?.name}
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${user?.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-700'}`}>
              {user?.role}
            </span>
          </span>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Leads</h2>
            <p className="text-gray-400 text-sm mt-0.5">{pagination.total} total leads</p>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === 'admin' && (
              <button
                onClick={handleExport}
                className="text-sm px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Export CSV
              </button>
            )}
            <button
              onClick={openCreate}
              className="text-sm px-4 py-2 rounded-lg bg-white text-gray-950 font-medium hover:bg-gray-100 transition-colors"
            >
              Add Lead
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-white rounded-lg px-4 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors w-64"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="bg-gray-900 border border-gray-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-600 transition-colors"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>
          <select
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value, page: 1 })}
            className="bg-gray-900 border border-gray-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-600 transition-colors"
          >
            <option value="">All Sources</option>
            <option value="website">Website</option>
            <option value="instagram">Instagram</option>
            <option value="referral">Referral</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as 'latest' | 'oldest', page: 1 })}
            className="bg-gray-900 border border-gray-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-600 transition-colors"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Table */}
        <div className="border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="text-left text-gray-400 font-medium px-4 py-3">Name</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Email</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Status</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Source</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Created</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-12">
                    Loading...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-12">
                    No leads found
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{lead.name}</td>
                    <td className="px-4 py-3 text-gray-400">{lead.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${sourceColors[lead.source]}`}>
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEdit(lead)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-400">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={filters.page === 1}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={filters.page === pagination.totalPages}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-5">
              {editLead ? 'Edit Lead' : 'Add Lead'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Lead name"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="lead@example.com"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Lead['status'] })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600 transition-colors"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Source</label>
                <select
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value as Lead['source'] })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600 transition-colors"
                >
                  <option value="website">Website</option>
                  <option value="instagram">Instagram</option>
                  <option value="referral">Referral</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 text-sm px-4 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 text-sm px-4 py-2.5 rounded-lg bg-white text-gray-950 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editLead ? 'Save changes' : 'Add lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;