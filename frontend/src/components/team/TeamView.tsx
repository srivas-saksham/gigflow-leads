import { useState, useEffect, useCallback } from 'react';
import { TeamTable } from './TeamTable';
import { TeamModal } from './TeamModal';
import { Button } from '../ui/Button';
import type { StaffUser } from './TeamTable';
import api from '../../utils/api';

const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const TeamView = () => {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<StaffUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/auth/users');
      setUsers(res.data.users);
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openCreate = () => { setEditUser(null); setModalOpen(true); };
  const openEdit = (user: StaffUser) => { setEditUser(user); setModalOpen(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member? This cannot be undone.')) return;
    try { await api.delete(`/api/auth/users/${id}`); fetchUsers(); } catch { /* noop */ }
  };

  const admins = users.filter((u) => u.role === 'admin').length;
  const sales = users.filter((u) => u.role === 'sales').length;

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">Team</h1>
          {!loading && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5 mono">
              {admins} admin{admins !== 1 ? 's' : ''}, {sales} sales
            </p>
          )}
          {loading && <div className="h-3 w-24 rounded bg-[var(--bg-raised)] animate-pulse mt-1" />}
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <PlusIcon /> Add member
        </Button>
      </div>

      <TeamTable users={users} loading={loading} onEdit={openEdit} onDelete={handleDelete} />

      <TeamModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchUsers}
        editUser={editUser}
      />
    </>
  );
};