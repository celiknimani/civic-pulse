import React, { lazy, Suspense, useState } from 'react';
import AdminLayout from './AdminLayout';
import AuthGate from './AuthGate';

const PromiseEditor = lazy(() => import('./PromiseEditor'));
const GovernmentEditor = lazy(() => import('./GovernmentEditor'));
const DeputiesEditor = lazy(() => import('./DeputiesEditor'));
const SourcesEditor = lazy(() => import('./SourcesEditor'));

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<'promises' | 'government' | 'deputies' | 'sources'>('promises');

  const renderTab = () => {
    switch (tab) {
      case 'promises':
        return <PromiseEditor />;
      case 'government':
        return <GovernmentEditor />;
      case 'deputies':
        return <DeputiesEditor />;
      case 'sources':
        return <SourcesEditor />;
    }
  };

  return (
    <AuthGate>
      <AdminLayout activeTab={tab} onSwitchTab={(next) => setTab(next as typeof tab)}>
        <Suspense fallback={<p className="text-sm font-semibold text-[#6e7a90]">Loading editor…</p>}>{renderTab()}</Suspense>
      </AdminLayout>
    </AuthGate>
  );
};

export default AdminDashboard;
