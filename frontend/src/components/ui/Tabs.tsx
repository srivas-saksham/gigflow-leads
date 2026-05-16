interface Tab { id: string; label: string }

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export const Tabs = ({ tabs, active, onChange }: TabsProps) => (
  <div className="flex items-end gap-0" style={{ borderBottom: '1px solid var(--border)' }}>
    {tabs.map((tab) => {
      const isActive = tab.id === active;
      return (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            relative px-4 py-2.5 text-xs font-medium tracking-wide cursor-pointer
            transition-colors duration-150 -mb-px
            ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}
          `}
        >
          {tab.label}
          {isActive && (
            <span
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: 'var(--amber)' }}
            />
          )}
        </button>
      );
    })}
  </div>
);