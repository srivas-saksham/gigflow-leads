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

const SkeletonRow = () => (
  <tr>
    {[1, 2, 3, 4, 5].map((i) => (
      <td key={i} className="px-4 py-3.5">
        <div className="h-3 rounded-md bg-[var(--bg-raised)] animate-pulse" style={{ width: `${50 + i * 9}%` }} />
      </td>
    ))}
  </tr>
);

const SkeletonCard = () => (
  <div className="rounded-xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
    <div className="flex items-start justify-between mb-3">
      <div className="space-y-2 flex-1">
        <div className="h-3.5 w-28 rounded bg-[var(--bg-raised)] animate-pulse" />
        <div className="h-3 w-40 rounded bg-[var(--bg-raised)] animate-pulse" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-5 w-12 rounded bg-[var(--bg-raised)] animate-pulse" />
      <div className="h-5 w-20 rounded bg-[var(--bg-raised)] animate-pulse" />
    </div>
  </div>
);

const Empty = ({ mobile }: { mobile?: boolean }) =>
  mobile ? (
    <div className="py-16 text-center">
      <p className="text-xs text-[var(--text-muted)] tracking-wide">No team members found</p>
    </div>
  ) : (
    <tr>
      <td colSpan={5} className="px-4 py-16 text-center">
        <p className="text-xs text-[var(--text-muted)] tracking-wide">No team members found</p>
      </td>
    </tr>
  );

interface MemberCardProps {
  user: StaffUser;
  onEdit: (user: StaffUser) => void;
  onDelete: (id: string) => void;
}

const MemberCard = ({ user, onEdit, onDelete }: MemberCardProps) => (
  <div
    className="rounded-xl p-4 transition-colors"
    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
  >
    {/* Top: name + actions */}
    <div className="flex items-start justify-between gap-2 mb-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
        <p className="text-[11px] text-[var(--text-muted)] mono truncate mt-0.5">{user.email}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(user)}
          className="px-2.5 py-1 rounded-md text-xs text-[var(--text-muted)] hover:text-[var(--amber)] hover:bg-[var(--amber-dim)] cursor-pointer transition-all"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="px-2.5 py-1 rounded-md text-xs text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--red-dim)] cursor-pointer transition-all"
        >
          Delete
        </button>
      </div>
    </div>

    {/* Bottom: role badge + joined date */}
    <div className="flex items-center gap-2">
      <RoleBadge role={user.role} />
      <span className="text-[11px] text-[var(--text-muted)] mono ml-auto">
        {new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
    </div>
  </div>
);

export const TeamTable = ({ users, loading, onEdit, onDelete }: TeamTableProps) => (
  <>
    {/* ── Desktop table (md+) ── */}
    <div className="hidden md:block rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
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
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
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
                      {new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
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

    {/* ── Mobile card list (below md) ── */}
    <div className="flex md:hidden flex-col gap-2">
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
      ) : users.length === 0 ? (
        <Empty mobile />
      ) : (
        users.map((u) => (
          <MemberCard key={u.id} user={u} onEdit={onEdit} onDelete={onDelete} />
        ))
      )}
    </div>
  </>
);