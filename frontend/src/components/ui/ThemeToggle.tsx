import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <style>{`
        .theme-toggle {
          position: relative;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: var(--text-muted);
          outline: none;
          flex-shrink: 0;
        }

        .theme-toggle:hover {
          color: var(--amber);
        }

        .theme-toggle-icon {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            opacity 250ms ease,
            transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .theme-toggle-icon.sun {
          opacity: ${isDark ? '1' : '0'};
          transform: ${isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.5)'};
        }

        .theme-toggle-icon.moon {
          opacity: ${isDark ? '0' : '1'};
          transform: ${isDark ? 'rotate(-90deg) scale(0.5)' : 'rotate(0deg) scale(1)'};
        }
      `}</style>

      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="theme-toggle"
      >
        {/* Sun — visible in dark mode, click to go light */}
        <span className="theme-toggle-icon sun">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </span>

        {/* Moon — visible in light mode, click to go dark */}
        <span className="theme-toggle-icon moon">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
      </button>
    </>
  );
};