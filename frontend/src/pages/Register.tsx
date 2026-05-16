import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import api from '../utils/api';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', form);
      login(res.data.token, res.data.user);
      // Customers always go to home
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join GigFlow to track your interest and stay updated."
      footer={
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-[var(--text-muted)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--amber)] hover:underline">Sign in</Link>
          </p>
          <Link
            to="/"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        <Input label="Name" id="name" placeholder="Your name" value={form.name} onChange={set('name')} autoComplete="name" required />
        <Input label="Email" id="email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" required />
        <Input label="Password" id="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} autoComplete="new-password" required />
        <Button type="submit" variant="primary" loading={loading} className="w-full justify-center !mt-6">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;