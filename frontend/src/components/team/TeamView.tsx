import { useState } from 'react';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { CredentialCard } from './CredentialCard';
import api from '../../utils/api';

interface CreatedStaff { name: string; email: string; password: string; role: string }

const defaultForm = { name: '', email: '', password: '', role: 'sales' as 'admin' | 'sales' };

export const TeamView = () => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<CreatedStaff | null>(null);

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/staff', form);
      setCreated({ name: res.data.user.name, email: res.data.user.email, password: form.password, role: res.data.user.role });
      setForm(defaultForm);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">Create staff account</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
          Add a new admin or sales user. Credentials are shared manually.
        </p>
      </div>

      {/* Credential display */}
      {created && <CredentialCard credentials={created} onDismiss={() => setCreated(null)} />}

      {/* Error */}
      {error && <div className="mb-4"><Alert variant="error" onDismiss={() => setError('')}>{error}</Alert></div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full name" id="staff-name" placeholder="Jane Smith" value={form.name} onChange={set('name')} required />
        <Input label="Email" id="staff-email" type="email" placeholder="jane@company.com" value={form.email} onChange={set('email')} required />
        <div>
          <Input
            label="Temporary password"
            id="staff-password"
            type="text"
            placeholder="Set a strong password"
            value={form.password}
            onChange={set('password')}
            required
          />
          <p className="text-[10px] text-[var(--text-muted)] mt-1">Shown once. Copy before submitting.</p>
        </div>
        <Select label="Role" id="staff-role" value={form.role} onChange={set('role')}>
          <option value="sales">Sales user</option>
          <option value="admin">Admin</option>
        </Select>
        <Button type="submit" variant="primary" loading={loading} className="w-full justify-center">
          Create account
        </Button>
      </form>
    </div>
  );
};