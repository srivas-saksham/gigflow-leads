import { RoleBadge } from '../ui/Badge';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
  createdAt: string;
}

interface TeamTableProps {
  users: StaffUser[];
  loading: boolean;
  onEdit: (user: StaffUser) => void;
  onDelete: (id: string) => void;
}

const Skeleton = () => (
  <tr>
    {[1, 2, 3, 4, 5].map((i) => (
      <td key={i} className="px-4 py-3.5">
        <div
          className="h-3 rounded-md bg-[var(--bg-raised)] animate-pulse"
          style={{ width: `${50 + i * 9}%` }}
        />
      </td>
    ))}
  </tr>
);

const Empty = () => (
  <tr>
    <td colSpan={5} className="px-4 py-16 text-center">
      <p className="text-xs text-[var(--text-muted)] tracking-wide">No team members found</p>
    </td>
  </tr>
);

export const TeamTable = ({ users, loading, onEdit, onDelete }: TeamTableProps) => (
  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
            {(['Name', 'Email', 'Role', 'Joined', 'Actions'] as const).map((h) => (
              <th
                key={h}
                className={`px-4 py-3 text-[10px] font-semibold text-[var(--text-muted)] tracking-widest uppercase ${h === 'Actions' ? 'text-right' : 'text-left'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)
          ) : users.length === 0 ? (
            <Empty />
          ) : (
            users.map((u) => (
              <tr
                key={u.id}
                className="transition-colors duration-100"
                style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="px-4 py-3.5">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{u.name}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs text-[var(--text-muted)] mono">{u.email}</span>
                </td>
                <td className="px-4 py-3.5">
                  <RoleBadge role={u.role} />
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs text-[var(--text-muted)] mono">
                    {new Date(u.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => onEdit(u)}
                      className="px-2.5 py-1 rounded-md text-xs text-[var(--text-muted)] hover:text-[var(--amber)] hover:bg-[var(--amber-dim)] cursor-pointer transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(u.id)}
                      className="px-2.5 py-1 rounded-md text-xs text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--red-dim)] cursor-pointer transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);