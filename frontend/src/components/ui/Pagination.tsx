import type { Pagination } from '../../types';

interface PaginationBarProps {
  pagination: Pagination;
  page: number;
  onPageChange: (page: number) => void;
}

export const PaginationBar = ({ pagination, page, onPageChange }: PaginationBarProps) => {
  if (pagination.totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-4">
      <span className="text-xs text-[var(--text-muted)] mono">
        {(page - 1) * pagination.limit + 1}–{Math.min(page * pagination.limit, pagination.total)} of {pagination.total}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
        >
          ← Prev
        </button>
        <span className="px-3 py-1.5 text-xs text-[var(--text-muted)] mono">
          {page} / {pagination.totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pagination.totalPages}
          className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
};