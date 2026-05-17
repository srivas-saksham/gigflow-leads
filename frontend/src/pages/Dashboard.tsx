import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Tabs } from '../components/ui/Tabs';
import { LeadsView } from '../components/leads/LeadsView';
import { TeamView } from '../components/team/TeamView';
import { LeadStatsProvider } from '../context/LeadStatsContext';

type TabId = 'leads' | 'team';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('leads');

  const tabs = [
    { id: 'leads', label: 'Leads' },
    ...(user?.role === 'admin' ? [{ id: 'team', label: 'Team' }] : []),
  ];

  return (
    <LeadStatsProvider>
      <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse 80% 50% at 10% 0%, rgba(245, 159, 11, 0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(245, 159, 11, 0.17) 0%, transparent 55%), var(--bg-base)' }}>
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-6">
          {/* Tabs */}
          <div className="mb-6">
            <Tabs tabs={tabs} active={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
          </div>

          {/* Views */}
          {activeTab === 'leads' && <LeadsView isAdmin={user?.role === 'admin'} />}
          {activeTab === 'team' && user?.role === 'admin' && <TeamView />}
        </main>
      </div>
    </LeadStatsProvider>
  );
};

export default Dashboard;