import { useState } from 'react';
import { useApp } from './lib/store';
import { useIsMobile } from './lib/useMediaQuery';
import { money, walletStatus } from './data';
import type { NotifItem } from './components/Header';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import { TopupModal, AdjustModal, RejectModal, AddUserModal, NewClientModal } from './components/Modals';
import type { Route, Portal } from './types';

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

const ROLE_BADGE: Record<Portal, { bg: string; fg: string; label: string }> = {
  admin: { bg: '#eaf1fe', fg: '#1f6feb', label: 'Admin' },
  staff: { bg: '#efecfb', fg: '#6b4ee0', label: 'Staff' },
  client: { bg: '#e0f2f0', fg: '#0c7a72', label: 'Client' },
};

export default function App() {
  const app = useApp();
  const { state, profile, portal, session, authLoading } = app;
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (authLoading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa1ad', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>Loading…</div>;
  }

  if (!session || !profile || state.route === 'login') {
    return (
      <>
        <Login onSubmit={app.login} error={app.authError} />
        {state.toast && <Toast msg={state.toast.msg} tone={state.toast.tone} />}
      </>
    );
  }

  const currentPortal = portal!;
  const badge = ROLE_BADGE[currentPortal];
  const clientCompany = profile.client_id ? (state.clients.find(c => c.id === profile.client_id)?.company ?? 'Client') : '';
  const me = {
    name: profile.full_name,
    sub: currentPortal === 'client' ? clientCompany : badge.label,
    initials: profile.initials,
    badgeBg: badge.bg,
    badgeFg: badge.fg,
  };
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

  const meta = PAGE_META[state.route] ?? { title: 'Khatova', sub: '' };
  const clientId = profile.client_id ?? '';

  const renderScreen = () => {
    switch (state.route) {
      case 'admin.dashboard':
        return <AdminDashboard state={state} goClients={() => app.go('admin.clients')} goApprovals={() => app.go('admin.approvals')} openClient={app.openClient} openTopup={app.openTopup} />;
      case 'admin.clients':
        return <AdminClients state={state} openClient={app.openClient} openTopup={app.openTopup} openNewClient={app.openNewClient} />;
      case 'admin.clientDetail':
        return <AdminClientDetail state={state} back={() => app.go('admin.clients')} openTopup={app.openTopup} openAdjust={app.openAdjust} openContract={app.openContract} setTab={app.setClientTab} />;
      case 'admin.contracts':
        return <AdminContracts state={state} openContract={app.openContract} goNewContract={() => app.go('admin.newContract')} />;
      case 'admin.contractDetail':
        return <AdminContractDetail state={state} back={() => app.go('admin.contracts')} />;
      case 'admin.newContract':
        return <AdminNewContract state={state} setNewType={app.setNewType} goContracts={() => app.go('admin.contracts')} createContract={app.createContract} />;
      case 'admin.approvals':
        return <AdminApprovals state={state} approve={app.approve} openReject={app.openReject} />;
      case 'admin.reports':
        return <AdminReports state={state} />;
      case 'admin.users':
        return <AdminTeam state={state} openAddUser={app.openAddUser} />;
      case 'staff.dashboard':
        return <StaffDashboard state={state} goLog={() => app.go('staff.log')} goLogForContract={(id) => { app.setLogContract(id); app.go('staff.log'); }} />;
      case 'staff.log':
        return <StaffLog
          state={state}
          setContract={app.setLogContract}
          setUnit={(k) => app.update('logUnit', k)}
          setQty={(q) => app.update('logQty', q)}
          submit={app.logUsage}
        />;
      case 'staff.history':
        return <StaffHistory state={state} myId={profile.id} />;
      case 'client.dashboard':
        return <ClientWallet state={state} clientId={clientId} />;
      case 'client.statement':
        return <ClientStatement state={state} clientId={clientId} />;
      case 'client.contracts':
        return <ClientContracts state={state} />;
      default:
        return null;
    }
  };

  const portalLabel = currentPortal === 'admin' ? 'ADMIN PORTAL' : currentPortal === 'staff' ? 'STAFF PORTAL' : 'CLIENT PORTAL';

  const SEARCHABLE: Record<string, string> = {
    'admin.clients': 'Search clients…',
    'admin.contracts': 'Search contracts…',
    'admin.users': 'Search team…',
    'staff.history': 'Search history…',
  };
  const searchPlaceholder = SEARCHABLE[state.route];

  // Role-aware notifications derived from live data
  const readSet = new Set(app.readNotifs);
  const notifications: NotifItem[] = [];
  if (currentPortal === 'admin') {
    if (pendingCount > 0) {
      notifications.push({
        id: 'approvals', icon: 'fact_check', color: '#8a5d08', bg: '#fbf0d9',
        title: `${pendingCount} approval${pendingCount === 1 ? '' : 's'} pending`,
        desc: 'Usage events are waiting for review.',
        onClick: () => app.go('admin.approvals'),
      });
    }
    state.clients.forEach(c => {
      const st = walletStatus(c.balance, c.threshold);
      if (st.key !== 'HEALTHY') {
        notifications.push({
          id: `wallet-${c.id}`, icon: st.key === 'NEGATIVE' ? 'error' : 'warning',
          color: st.key === 'NEGATIVE' ? '#b5362b' : '#8a5d08', bg: st.key === 'NEGATIVE' ? '#fbe9e7' : '#fbf0d9',
          title: `${c.company} · ${st.label.toLowerCase()}`,
          desc: `Wallet balance ${money(c.balance, false)}.`,
          onClick: () => app.openClient(c.id),
        });
      }
    });
  } else if (currentPortal === 'staff') {
    const pendingMine = state.events.filter(e => e.status === 'PENDING').length;
    if (pendingMine > 0) {
      notifications.push({
        id: 'mine-pending', icon: 'hourglass_top', color: '#8a5d08', bg: '#fbf0d9',
        title: `${pendingMine} event${pendingMine === 1 ? '' : 's'} awaiting approval`,
        desc: 'Submitted usage is under review.',
        onClick: () => app.go('staff.history'),
      });
    }
    state.events.filter(e => e.status === 'REJECTED').slice(0, 5).forEach(e => {
      notifications.push({
        id: `rej-${e.id}`, icon: 'cancel', color: '#b5362b', bg: '#fbe9e7',
        title: 'Usage event rejected',
        desc: e.reason ? `${e.desc} — ${e.reason}` : e.desc,
        onClick: () => app.go('staff.history'),
      });
    });
  } else if (currentPortal === 'client') {
    const c = state.clients.find(x => x.id === clientId);
    if (c) {
      const st = walletStatus(c.balance, c.threshold);
      if (st.key !== 'HEALTHY') {
        notifications.push({
          id: 'my-wallet', icon: st.key === 'NEGATIVE' ? 'error' : 'warning',
          color: st.key === 'NEGATIVE' ? '#b5362b' : '#8a5d08', bg: st.key === 'NEGATIVE' ? '#fbe9e7' : '#fbf0d9',
          title: st.key === 'NEGATIVE' ? 'Wallet balance is negative' : 'Low wallet balance',
          desc: `Current balance ${money(c.balance, false)}. Contact your account manager to top up.`,
          onClick: () => app.go('client.dashboard'),
        });
      }
    }
    (state.ledgers[clientId] || []).filter(l => l.type === 'DEBIT').slice(0, 4).forEach((l, i) => {
      notifications.push({
        id: `debit-${i}`, icon: 'receipt_long', color: '#1f6feb', bg: '#eaf1fe',
        title: `New charge · ${money(l.amount, false)}`,
        desc: `${l.desc} (${l.date}).`,
        onClick: () => app.go('client.statement'),
      });
    });
  }

  notifications.forEach(n => { n.read = readSet.has(n.id); });
  const allNotifIds = notifications.map(n => n.id);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f7f9', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      {!isMobile && (
        <Sidebar portalLabel={portalLabel} nav={nav} me={me} />
      )}

      {isMobile && drawerOpen && (
        <div className="k-backdrop" onClick={() => setDrawerOpen(false)} />
      )}
      {isMobile && (
        <Sidebar
          portalLabel={portalLabel} nav={nav} me={me}
          mobile open={drawerOpen} onClose={() => setDrawerOpen(false)}
        />
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header
          title={meta.title} sub={meta.sub} me={me} onLogout={app.logout}
          onMenu={isMobile ? () => setDrawerOpen(true) : undefined}
          notifications={notifications}
          onReadNotif={(id) => app.markNotifsRead([id])}
          onReadAllNotifs={() => app.markNotifsRead(allNotifIds)}
          search={app.search} onSearch={app.setSearch}
          searchPlaceholder={searchPlaceholder ?? 'Search…'}
          showSearch={!!searchPlaceholder}
        />
        <main className="k-main" style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
          {renderScreen()}
        </main>
      </div>

      {state.modal === 'topup' && (
        <TopupModal data={state.modalData} onClose={app.closeModal}
          onSubmit={(amt, method, ref) => app.topup(state.modalData.id, amt, method, ref)} />
      )}
      {state.modal === 'adjust' && (
        <AdjustModal data={state.modalData} onClose={app.closeModal}
          onSubmit={(amt, dir, reason) => app.adjust(state.modalData.id, amt, dir, reason)} />
      )}
      {state.modal === 'reject' && (
        <RejectModal data={state.modalData} onClose={app.closeModal}
          onSubmit={(reason) => app.reject(state.modalData.id, reason)} />
      )}
      {state.modal === 'adduser' && (
        <AddUserModal clients={state.clients} onClose={app.closeModal} onSubmit={app.inviteUser} />
      )}
      {state.modal === 'newclient' && (
        <NewClientModal onClose={app.closeModal} onSubmit={app.createClient} />
      )}

      {state.toast && <Toast msg={state.toast.msg} tone={state.toast.tone} />}
    </div>
  );
}
