import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Lead } from '../../types';
import api from '../../utils/api';

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  editLead: Lead | null;
  onSuccess: () => void;
}

const defaultForm = {
  name: '',
  email: '',
  status: 'new' as Lead['status'],
  source: 'website' as Lead['source'],
};

export const LeadModal = ({ open, onClose, editLead, onSuccess }: LeadModalProps) => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editLead) {
      setForm({ name: editLead.name, email: editLead.email, status: editLead.status, source: editLead.source });
    } else {
      setForm(defaultForm);
    }
    setError('');
  }, [editLead, open]);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required.'); return; }
    setLoading(true);
    setError('');
    try {
      if (editLead) {
        await api.put(`/api/leads/${editLead._id}`, form);
      } else {
        await api.post('/api/leads', form);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editLead ? 'Edit lead' : 'Add lead'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} className="flex-1 justify-center">Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading} className="flex-1 justify-center">
            {editLead ? 'Save changes' : 'Add lead'}
          </Button>
        </>
      }
    >
      {error && (
        <div className="px-3 py-2.5 rounded-lg text-xs text-red-400 bg-[var(--red-dim)] border border-[var(--red-border)]">
          {error}
        </div>
      )}
      <Input label="Name" id="lead-name" placeholder="Full name" value={form.name} onChange={set('name')} required />
      <Input label="Email" id="lead-email" type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} required />
      <Select label="Status" id="lead-status" value={form.status} onChange={set('status')}>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="lost">Lost</option>
      </Select>
      <Select label="Source" id="lead-source" value={form.source} onChange={set('source')}>
        <option value="website">Website</option>
        <option value="instagram">Instagram</option>
        <option value="referral">Referral</option>
      </Select>
    </Modal>
  );
};