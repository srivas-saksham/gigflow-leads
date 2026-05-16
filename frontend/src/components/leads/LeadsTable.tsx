import type { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  isAdmin: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const Skeleton = () => (
  <tr>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <td key={i} className="px-4 py-3.5">
        <div className="h-3 rounded-md bg-[var(--bg-raised)] animate-pulse" style={{ width: `${60 + i * 8}%` }} />
      </td>
    ))}
  </tr>
);

const Empty = () => (
  <tr>
    <td colSpan={6} className="px-4 py-16 text-center">
      <p className="text-xs text-[var(--text-muted)] tracking-wide">No leads found</p>
    </td>
  </tr>
);

export const LeadsTable = ({ leads, loading, isAdmin, onEdit, onDelete }: LeadsTableProps) => (
  <div
    className="rounded-xl overflow-hidden"
    style={{ border: '1px solid var(--border)' }}
  >
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
            {['Name', 'Email', 'Status', 'Source', 'Created', ''].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--text-muted)] tracking-widest uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)
          ) : leads.length === 0 ? (
            <Empty />
          ) : (
            leads.map((lead) => (
              <tr
                key={lead._id}
                className="group transition-colors duration-100"
                style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="px-4 py-3.5">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{lead.name}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs text-[var(--text-muted)] mono">{lead.email}</span>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3.5">
                  <SourceBadge source={lead.source} />
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs text-[var(--text-muted)] mono">
                    {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(lead)}
                      className="px-2.5 py-1 rounded-md text-xs text-[var(--text-muted)] hover:text-[var(--amber)] hover:bg-[var(--amber-dim)] cursor-pointer transition-all"
                    >
                      Edit
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => onDelete(lead._id)}
                        className="px-2.5 py-1 rounded-md text-xs text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--red-dim)] cursor-pointer transition-all"
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
  </div>
);