import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { CredentialCard } from './CredentialCard';
import type { StaffUser } from './TeamTable';
import api from '../../utils/api';

interface TeamModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editUser?: StaffUser | null;
}

const defaultForm = { name: '', email: '', password: '', role: 'sales' as 'admin' | 'sales' };

interface CreatedStaff { name: string; email: string; password: string; role: string }

export const TeamModal = ({ open, onClose, onSuccess, editUser }: TeamModalProps) => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<CreatedStaff | null>(null);

  const isEdit = !!editUser;

  useEffect(() => {
    if (open) {
      setError('');
      setCreated(null);
      if (editUser) {
        setForm({ name: editUser.name, email: editUser.email, password: '', role: editUser.role });
      } else {
        setForm(defaultForm);
      }
    }
  }, [open, editUser]);

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required.'); return; }
    if (!isEdit && !form.password.trim()) { setError('Password is required.'); return; }
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        // only send changed fields
        const payload: Record<string, string> = { name: form.name, email: form.email, role: form.role };
        if (form.password.trim()) payload.password = form.password;
        await api.put(`/api/auth/users/${editUser!.id}`, payload);
        onSuccess();
        onClose();
      } else {
        const res = await api.post('/api/auth/staff', form);
        setCreated({ name: res.data.user.name, email: res.data.user.email, password: form.password, role: res.data.user.role });
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { setCreated(null); onClose(); };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={created ? 'Account created' : isEdit ? 'Edit member' : 'Add team member'}
      footer={
        created ? (
          <Button variant="primary" onClick={handleClose} className="flex-1 justify-center">Done</Button>
        ) : (
          <>
            <Button variant="ghost" onClick={handleClose} className="flex-1 justify-center">Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} loading={loading} className="flex-1 justify-center">
              {isEdit ? 'Save changes' : 'Create account'}
            </Button>
          </>
        )
      }
    >
      {created ? (
        <CredentialCard credentials={created} onDismiss={handleClose} />
      ) : (
        <>
          {error && (
            <div className="px-3 py-2.5 rounded-lg text-xs text-red-400 bg-[var(--red-dim)] border border-[var(--red-border)]">
              {error}
            </div>
          )}
          <Input label="Full name" id="staff-name" placeholder="Jane Smith" value={form.name} onChange={set('name')} required />
          <Input label="Email" id="staff-email" type="email" placeholder="jane@company.com" value={form.email} onChange={set('email')} required />
          <div>
            <Input
              label={isEdit ? 'New password (optional)' : 'Temporary password'}
              id="staff-password"
              type="text"
              placeholder={isEdit ? 'Leave blank to keep current' : 'Set a strong password'}
              value={form.password}
              onChange={set('password')}
              required={!isEdit}
            />
            {!isEdit && <p className="text-[10px] text-[var(--text-muted)] mt-1">Shown once after creation. Copy before closing.</p>}
          </div>
          <Select label="Role" id="staff-role" value={form.role} onChange={set('role')}>
            <option value="sales">Sales user</option>
            <option value="admin">Admin</option>
          </Select>
        </>
      )}
    </Modal>
  );
};