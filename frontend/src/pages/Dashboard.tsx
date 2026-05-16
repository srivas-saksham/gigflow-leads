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

const emptyLeadForm = {
  name: '',
  email: '',
  status: 'new' as Lead['status'],
  source: 'website' as Lead['source'],
};

const emptyStaffForm = {
  name: '',
  email: '',
  password: '',
  role: 'sales' as 'admin' | 'sales',
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'leads' | 'team'>('leads');

  // leads state
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<LeadFilters>({
    status: '',
    source: '',
    search: '',
    sortBy: 'latest',
    page: 1,
  });
  const debouncedSearch = useDebounce(searchInput, 400);
  const activeFilters = { ...filters, search: debouncedSearch };
  const { leads, pagination, loading, refetch } = useLeads(activeFilters);

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [leadForm, setLeadForm] = useState(emptyLeadForm);
  const [submittingLead, setSubmittingLead] = useState(false);

  // team state
  const [staffForm, setStaffForm] = useState(emptyStaffForm);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffSuccess, setStaffSuccess] = useState('');
  const [staffError, setStaffError] = useState('');

  const [createdStaff, setCreatedStaff] = useState<{
    name: string;
    email: string;
    password: string;
    role: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `GigFlow Login Credentials\n\nName: ${createdStaff?.name}\nEmail: ${createdStaff?.email}\nPassword: ${createdStaff?.password}\nRole: ${createdStaff?.role}\n\nLogin at: ${window.location.origin}/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openCreate = () => {
    setEditLead(null);
    setLeadForm(emptyLeadForm);
    setShowLeadModal(true);
  };

  const openEdit = (lead: Lead) => {
    setEditLead(lead);
    setLeadForm({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
    });
    setShowLeadModal(true);
  };

  const handleLeadSubmit = async () => {
    if (!leadForm.name || !leadForm.email) return;
    setSubmittingLead(true);
    try {
      if (editLead) {
        await api.put(`/api/leads/${editLead._id}`, leadForm);
      } else {
        await api.post('/api/leads', leadForm);
      }
      setShowLeadModal(false);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingLead(false);
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

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffLoading(true);
    setStaffSuccess('');
    setStaffError('');
    try {
      const res = await api.post('/api/auth/staff', staffForm);
      setStaffSuccess(
        `Account created for ${res.data.user.name} (${res.data.user.role}). Share these credentials with them directly.`
      );
      setCreatedStaff({
        name: res.data.user.name,
        email: res.data.user.email,
        password: staffForm.password,
        role: res.data.user.role,
      });
      setStaffForm(emptyStaffForm);
    } catch (err: any) {
      setStaffError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setStaffLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
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
        {/* Tabs — only admin sees Team tab */}
        <div className="flex items-center gap-1 mb-6 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'leads'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Leads
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'team'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Team
            </button>
          )}
        </div>

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <>
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
                      <td colSpan={6} className="text-center text-gray-500 py-12">Loading...</td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500 py-12">No leads found</td>
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
          </>
        )}

        {/* Team Tab — admin only */}
        {activeTab === 'team' && user?.role === 'admin' && (
          <div className="max-w-md">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Create staff account</h2>
              <p className="text-gray-400 text-sm mt-0.5">
                Add a new admin or sales user. Share the credentials with them directly.
              </p>
            </div>

            {createdStaff && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <p className="text-sm font-medium text-white">Account created successfully</p>
                </div>
                <button
                  onClick={() => setCreatedStaff(null)}
                  className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
                >
                  Dismiss
                </button>
              </div>

              <div className="bg-gray-800/60 rounded-lg p-4 font-mono text-sm space-y-1.5 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 w-20 shrink-0">Name</span>
                  <span className="text-white">{createdStaff.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 w-20 shrink-0">Email</span>
                  <span className="text-white">{createdStaff.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 w-20 shrink-0">Password</span>
                  <span className="text-white">{createdStaff.password}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 w-20 shrink-0">Role</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    createdStaff.role === 'admin'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : 'bg-gray-500/10 text-gray-400 border-gray-700'
                  }`}>
                    {createdStaff.role}
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-1 border-t border-gray-700/50 mt-2">
                  <span className="text-gray-500 w-20 shrink-0">Login</span>
                  <span className="text-gray-400">{window.location.origin}/login</span>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                  copied
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {copied ? 'Copied to clipboard' : 'Copy credentials'}
              </button>

              <p className="text-xs text-gray-600 mt-3 text-center">
                Share these credentials directly. 
              </p>
              <p className="text-xs text-gray-600 text-center">
                Ask the user to change their password after first login.
              </p>
            </div>
          )}

            {staffError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
                {staffError}
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Name</label>
                <input
                  type="text"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  placeholder="Full name"
                  required
                  className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  placeholder="staff@company.com"
                  required
                  className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                <input
                  type="text"
                  value={staffForm.password}
                  onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                  placeholder="Set a temporary password"
                  required
                  className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Role</label>
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as 'admin' | 'sales' })}
                  className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600 transition-colors"
                >
                  <option value="sales">Sales User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={staffLoading}
                className="w-full bg-white text-gray-950 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {staffLoading ? 'Creating...' : 'Create account'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Lead Modal */}
      {showLeadModal && (
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
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder="Lead name"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  placeholder="lead@example.com"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Status</label>
                <select
                  value={leadForm.status}
                  onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value as Lead['status'] })}
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
                  value={leadForm.source}
                  onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value as Lead['source'] })}
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
                onClick={() => setShowLeadModal(false)}
                className="flex-1 text-sm px-4 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLeadSubmit}
                disabled={submittingLead}
                className="flex-1 text-sm px-4 py-2.5 rounded-lg bg-white text-gray-950 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {submittingLead ? 'Saving...' : editLead ? 'Save changes' : 'Add lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;