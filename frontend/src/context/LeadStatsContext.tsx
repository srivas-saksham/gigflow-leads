import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface LeadStatsContextType {
  refreshStats: () => void;
  statsVersion: number;
}

const LeadStatsContext = createContext<LeadStatsContextType | null>(null);

export const LeadStatsProvider = ({ children }: { children: ReactNode }) => {
  const [statsVersion, setStatsVersion] = useState(0);
  const refreshStats = useCallback(() => setStatsVersion((v) => v + 1), []);
  return (
    <LeadStatsContext.Provider value={{ refreshStats, statsVersion }}>
      {children}
    </LeadStatsContext.Provider>
  );
};

export const useLeadStats = () => {
  const ctx = useContext(LeadStatsContext);
  if (!ctx) throw new Error('useLeadStats must be used within LeadStatsProvider');
  return ctx;
};