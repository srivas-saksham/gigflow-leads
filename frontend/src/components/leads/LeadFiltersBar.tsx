import type { LeadFilters } from '../../types';

interface LeadFiltersBarProps {
  searchInput: string;
  onSearchChange: (v: string) => void;
  filters: LeadFilters;
  onFilterChange: (partial: Partial<LeadFilters>) => void;
}

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);

const selectClass = `
  bg-[var(--bg-surface)] border border-[var(--border)]
  text-[var(--text-secondary)] rounded-lg px-3 py-2 text-xs
  hover:border-[var(--border-hover)] focus:outline-none focus:border-[var(--amber)]
  cursor-pointer transition-all duration-150 appearance-none pr-7
`;

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%23555' stroke-width='2' d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 8px center',
  backgroundSize: '12px',
};

export const LeadFiltersBar = ({ searchInput, onSearchChange, filters, onFilterChange }: LeadFiltersBarProps) => (
  <div className="flex flex-wrap items-center gap-2">
    {/* Search */}
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
        <SearchIcon />
      </span>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search leads..."
        className={`
          bg-[var(--bg-surface)] border border-[var(--border)]
          text-[var(--text-primary)] placeholder-[var(--text-muted)]
          rounded-lg pl-8 pr-4 py-2 text-xs w-52
          hover:border-[var(--border-hover)] focus:outline-none focus:border-[var(--amber)]
          transition-all duration-150
        `}
      />
    </div>

    {/* Status */}
    <select
      value={filters.status}
      onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
      className={selectClass}
      style={selectStyle}
    >
      <option value="">All status</option>
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="qualified">Qualified</option>
      <option value="lost">Lost</option>
    </select>

    {/* Source */}
    <select
      value={filters.source}
      onChange={(e) => onFilterChange({ source: e.target.value, page: 1 })}
      className={selectClass}
      style={selectStyle}
    >
      <option value="">All sources</option>
      <option value="website">Website</option>
      <option value="instagram">Instagram</option>
      <option value="referral">Referral</option>
    </select>

    {/* Sort */}
    <select
      value={filters.sortBy}
      onChange={(e) => onFilterChange({ sortBy: e.target.value as 'latest' | 'oldest', page: 1 })}
      className={selectClass}
      style={selectStyle}
    >
      <option value="latest">Latest</option>
      <option value="oldest">Oldest</option>
    </select>
  </div>
);