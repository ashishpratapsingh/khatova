import { useAppState } from './useAppState';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import { TopupModal, AdjustModal, RejectModal, AddUserModal } from './components/Modals';
import type { Route } from './types';

// Screens
import AdminDashboard from './screens/AdminDashboard';
import AdminClients from './screens/AdminClients';
import AdminClientDetail from './screens/AdminClientDetail';
import AdminContracts from './screens/AdminContracts';
import AdminContractDetail from './screens/AdminContractDetail';
import AdminNewContract from './screens/AdminNewContract';
import AdminApprovals from './screens/AdminApprovals';
import AdminReports from './screens/AdminReports';
import AdminTeam from './screens/AdminTeam';
import StaffDashboard from './screens/StaffDashboard';
import StaffLog from './screens/StaffLog';
import StaffHistory from './screens/StaffHistory';
import ClientWallet from './screens/ClientWallet';
import ClientStatement from './screens/ClientStatement';
import ClientContracts from './screens/ClientContracts';

type Portal = 'admin' | 'staff' | 'client';

function portalOf(route: Route): Portal | null {
  if (route === 'login') return null;
  if (route.startsWith('admin.')) return 'admin';
  if (route.startsWith('staff.')) return 'staff';
  return 'client';
}

const PAGE_META: Record<string, { title: string; sub: string }> = {
  'admin.dashboard': { title: 'Dashboard', sub: 'Overview of wallets, approvals and usage' },
  'admin.clients': { title: 'Clients', sub: 'Manage wallet balances and policies' },
  'admin.clientDetail': { title: 'Client detail', sub: 'Ledger, contracts and settings' },
  'admin.contracts': { title: 'Contracts', sub: 'All service contracts and rate cards' },
  'admin.contractDetail': { title: 'Contract detail', sub: 'Rates, staff and usage events' },
  'admin.newContract': { title: 'New contract', sub: 'Create and configure a billing contract' },
  'admin.approvals': { title: 'Approvals', sub: 'Review and approve pending usage events' },
  'admin.reports': { title: 'Reports', sub: 'Revenue, utilization and burn rate' },
  'admin.users': { title: 'Team', sub: 'Users, roles and permissions' },
  'staff.dashboard': { title: 'My dashboard', sub: 'Your active contracts and recent activity' },
  'staff.log': { title: 'Log usage', sub: 'Record billable work against a contract' },
  'staff.history': { title: 'My history', sub: 'All events you have submitted' },
  'client.dashboard': { title: 'Wallet', sub: 'Your balance and recent transactions' },
  'client.statement': { title: 'Statement', sub: 'Full ledger for the current period' },
  'client.contracts': { title: 'Contracts', sub: 'Your active service contracts and rates' },
};

const ME_MAP: Record<Portal, { name: string; sub: string; initials: string; badgeBg: string; badgeFg: string }> = {
  admin: { name: 'Maya Kapoor', sub: 'Admin', initials: 'MK', badgeBg: '#eaf1fe', badgeFg: '#1f6feb' },
  staff: { name: 'Priya Sharma', sub: 'Staff', initials: 'PS', badgeBg: '#efecfb', badgeFg: '#6b4ee0' },
  client: { name: 'Vikram Rao', sub: 'Acme Retail', initials: 'VR', badgeBg: '#e0f2f0', badgeFg: '#0c7a72' },
};

export default function App() {
  const app = useAppState();
  const { state } = app;
  const portal = portalOf(state.route);

  if (state.route === 'login') {
    return (
      <>
        <Login
          onLoginAdmin={() => app.goPortal('admin')}
          onLoginStaff={() => app.goPortal('staff')}
          onLoginClient={() => app.goPortal('client')}
        />
        {state.toast && <Toast msg={state.toast.msg} tone={state.toast.tone} />}
      </>
    );
  }

  const currentPortal = portal!;
  const me = ME_MAP[currentPortal];
  const pendingCount = state.events.filter(e => e.status === 'PENDING').length;

  const nav = currentPortal === 'admin'
    ? [
        { icon: 'dashboard', label: 'Dashboard', route: 'admin.dashboard' as Route, active: state.route === 'admin.dashboard', onClick: () => app.go('admin.dashboard') },
        { icon: 'account_balance_wallet', label: 'Clients', route: 'admin.clients' as Route, active: state.route === 'admin.clients' || state.route === 'admin.clientDetail', onClick: () => app.go('admin.clients') },
        { icon: 'description', label: 'Contracts', route: 'admin.contracts' as Route, active: state.route === 'admin.contracts' || state.route === 'admin.contractDetail' || state.route === 'admin.newContract', onClick: () => app.go('admin.contracts') },
        { icon: 'fact_check', label: 'Approvals', route: 'admin.approvals' as Route, active: state.route === 'admin.approvals', badge: pendingCount, onClick: () => app.go('admin.approvals') },
        { icon: 'bar_chart', label: 'Reports', route: 'admin.reports' as Route, active: state.route === 'admin.reports', onClick: () => app.go('admin.reports') },
        { icon: 'group', label: 'Team', route: 'admin.users' as Route, active: state.route === 'admin.users', onClick: () => app.go('admin.users') },
      ]
    : currentPortal === 'staff'
    ? [
        { icon: 'home', label: 'Dashboard', route: 'staff.dashboard' as Route, active: state.route === 'staff.dashboard', onClick: () => app.go('staff.dashboard') },
        { icon: 'edit_note', label: 'Log usage', route: 'staff.log' as Route, active: state.route === 'staff.log', onClick: () => app.go('staff.log') },
        { icon: 'history', label: 'My history', route: 'staff.history' as Route, active: state.route === 'staff.history', onClick: () => app.go('staff.history') },
      ]
    : [
        { icon: 'account_balance_wallet', label: 'Wallet', route: 'client.dashboard' as Route, active: state.route === 'client.dashboard', onClick: () => app.go('client.dashboard') },
        { icon: 'receipt_long', label: 'Statement', route: 'client.statement' as Route, active: state.route === 'client.statement', onClick: () => app.go('client.statement') },
        { icon: 'description', label: 'Contracts', route: 'client.contracts' as Route, active: state.route === 'client.contracts', onClick: () => app.go('client.contracts') },
      ];

  const portalSwitch = [
    { label: 'Admin', active: currentPortal === 'admin', onClick: () => app.goPortal('admin') },
    { label: 'Staff', active: currentPortal === 'staff', onClick: () => app.goPortal('staff') },
    { label: 'Client', active: currentPortal === 'client', onClick: () => app.goPortal('client') },
  ];

  const meta = PAGE_META[state.route] ?? { title: 'Khatova', sub: '' };

  const renderScreen = () => {
    switch (state.route) {
      case 'admin.dashboard':
        return <AdminDashboard state={state} goClients={() => app.go('admin.clients')} goApprovals={() => app.go('admin.approvals')} openClient={app.openClient} openTopup={app.openTopup} />;
      case 'admin.clients':
        return <AdminClients state={state} openClient={app.openClient} openTopup={app.openTopup} openAddUser={app.openAddUser} />;
      case 'admin.clientDetail':
        return <AdminClientDetail state={state} back={() => app.go('admin.clients')} openTopup={app.openTopup} openAdjust={app.openAdjust} openContract={app.openContract} setTab={app.setClientTab} />;
      case 'admin.contracts':
        return <AdminContracts openContract={app.openContract} goNewContract={() => app.go('admin.newContract')} />;
      case 'admin.contractDetail':
        return <AdminContractDetail state={state} back={() => app.go('admin.contracts')} />;
      case 'admin.newContract':
        return <AdminNewContract state={state} setNewType={app.setNewType} goContracts={() => app.go('admin.contracts')} saveContract={() => { app.flash('Contract created'); app.go('admin.contracts'); }} />;
      case 'admin.approvals':
        return <AdminApprovals state={state} approve={app.approve} openReject={app.openReject} />;
      case 'admin.reports':
        return <AdminReports />;
      case 'admin.users':
        return <AdminTeam openAddUser={app.openAddUser} />;
      case 'staff.dashboard':
        return <StaffDashboard goLog={() => app.go('staff.log')} goLogForContract={(id) => { app.setLogContract(id); app.go('staff.log'); }} />;
      case 'staff.log':
        return <StaffLog
          state={state}
          setContract={app.setLogContract}
          setUnit={(k) => app.update('logUnit', k)}
          setQty={(q) => app.update('logQty', q)}
          submit={app.submitLog}
          reset={() => { app.update('logQty', ''); app.update('logUnit', ''); }}
        />;
      case 'staff.history':
        return <StaffHistory state={state} />;
      case 'client.dashboard':
        return <ClientWallet state={state} openTopup={app.openTopup} />;
      case 'client.statement':
        return <ClientStatement state={state} />;
      case 'client.contracts':
        return <ClientContracts />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f7f9', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <Sidebar
        portalLabel={currentPortal === 'admin' ? 'ADMIN PORTAL' : currentPortal === 'staff' ? 'STAFF PORTAL' : 'CLIENT PORTAL'}
        nav={nav}
        portalSwitch={portalSwitch}
        me={me}
        onLogout={app.logout}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header title={meta.title} sub={meta.sub} me={me} />
        <main style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
          {renderScreen()}
        </main>
      </div>

      {state.modal === 'topup' && (
        <TopupModal state={state} onClose={app.closeModal} onSubmit={app.submitTopup} />
      )}
      {state.modal === 'adjust' && (
        <AdjustModal state={state} onClose={app.closeModal} onSubmit={app.submitAdjust} />
      )}
      {state.modal === 'reject' && (
        <RejectModal state={state} onClose={app.closeModal} onSubmit={app.submitReject} />
      )}
      {state.modal === 'adduser' && (
        <AddUserModal onClose={app.closeModal} onSubmit={app.submitInvite} />
      )}

      {state.toast && <Toast msg={state.toast.msg} tone={state.toast.tone} />}
    </div>
  );
}
