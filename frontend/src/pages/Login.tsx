import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import api from '../utils/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', form);
      login(res.data.token, res.data.user);
      // Redirect based on role
      if (res.data.user.role === 'customer') {
        navigate('/');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Enter your credentials to access your account"
      footer={
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-[var(--text-muted)]">
            No account?{' '}
            <Link to="/register" className="text-[var(--amber)] hover:underline">Create one</Link>
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
        <Input label="Email" id="email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" required />
        <Input label="Password" id="password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} autoComplete="current-password" required />
        <Button type="submit" variant="primary" loading={loading} className="w-full justify-center !mt-6">
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;