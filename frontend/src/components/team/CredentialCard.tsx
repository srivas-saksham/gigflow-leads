import { useState } from 'react';

interface Credentials {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface CredentialCardProps {
  credentials: Credentials;
  onDismiss: () => void;
}

export const CredentialCard = ({ credentials, onDismiss }: CredentialCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `GigFlow Login Credentials\n\nName: ${credentials.name}\nEmail: ${credentials.email}\nPassword: ${credentials.password}\nRole: ${credentials.role}\n\nLogin at: ${window.location.origin}/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rows = [
    { label: 'Name', value: credentials.name, mono: false },
    { label: 'Email', value: credentials.email, mono: true },
    { label: 'Password', value: credentials.password, mono: true },
    { label: 'Role', value: credentials.role, mono: true },
    { label: 'Login', value: `${window.location.origin}/login`, mono: true },
  ];

  return (
    <div
      className="rounded-xl mb-6 overflow-hidden"
      style={{ border: '1px solid var(--green-border)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: 'var(--green-dim)', borderBottom: '1px solid var(--green-border)' }}>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-xs font-medium text-green-400">Account created</span>
        </div>
        <button
          onClick={onDismiss}
          className="text-xs text-green-600 hover:text-green-400 cursor-pointer transition-colors"
        >
          Dismiss
        </button>
      </div>

      {/* Credentials */}
      <div className="divide-y divide-[var(--border)]">
        {rows.map(({ label, value, mono }) => (
          <div key={label} className="flex items-center gap-4 px-4 py-2.5" style={{ background: 'var(--bg-surface)' }}>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider w-16 shrink-0">{label}</span>
            <span className={`text-xs text-[var(--text-primary)] flex-1 ${mono ? 'mono' : ''} break-all`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Copy button */}
      <div className="px-4 py-3" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleCopy}
          className={`w-full py-2 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
            copied
              ? 'bg-[var(--green-dim)] border-[var(--green-border)] text-green-400'
              : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
          }`}
        >
          {copied ? '✓ Copied to clipboard' : 'Copy credentials'}
        </button>
        <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">
          Share directly. Ask user to change password after first login.
        </p>
      </div>
    </div>
  );
};