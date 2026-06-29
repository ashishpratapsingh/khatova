import type { ClientMeta, Contract, UsageEvent, LedgerEntry, ContractType } from './types';

export const CLIENTS: ClientMeta[] = [
  { id: 'c_acme', company: 'Acme Retail', contact: 'Vikram Rao', email: 'billing@acmeretail.in', initials: 'AR', threshold: 5000000, policy: 'BLOCK', last: '2h ago' },
  { id: 'c_bluewave', company: 'Bluewave Logistics', contact: 'Sana Iqbal', email: 'accounts@bluewave.in', initials: 'BL', threshold: 2500000, policy: 'PAUSE', last: '1d ago' },
  { id: 'c_cedar', company: 'Cedar Health', contact: 'Dr. Anil Menon', email: 'finance@cedarhealth.in', initials: 'CH', threshold: 3000000, policy: 'BLOCK', last: '3d ago' },
  { id: 'c_delta', company: 'Delta Media', contact: 'Farah Khan', email: 'ap@deltamedia.in', initials: 'DM', threshold: 1000000, policy: 'ALLOW', last: '5h ago' },
  { id: 'c_evergreen', company: 'Evergreen EdTech', contact: 'Karan Bose', email: 'billing@evergreen.edu', initials: 'EE', threshold: 4000000, policy: 'BLOCK', last: '2d ago' },
];

export const CONTRACTS: Contract[] = [
  { id: 'k1', name: 'E-commerce Platform Build', clientId: 'c_acme', client: 'Acme Retail', type: 'HOURLY', status: 'ACTIVE', approval: 'MANUAL', start: 'Jan 15, 2025', end: '—', rateSummary: '₹1,000–₹2,500 / hr', staffCount: 3 },
  { id: 'k2', name: 'Operations Retainer', clientId: 'c_bluewave', client: 'Bluewave Logistics', type: 'SUBSCRIPTION', status: 'ACTIVE', approval: 'AUTO', start: 'Mar 1, 2025', end: '—', rateSummary: '₹10,000 / month', staffCount: 1 },
  { id: 'k3', name: 'Patient Portal App', clientId: 'c_cedar', client: 'Cedar Health', type: 'MILESTONE', status: 'ACTIVE', approval: 'MANUAL', start: 'Feb 1, 2025', end: '—', rateSummary: '3 milestones · ₹2,30,000', staffCount: 2 },
  { id: 'k4', name: 'API Usage Plan', clientId: 'c_delta', client: 'Delta Media', type: 'METERED', status: 'ACTIVE', approval: 'AUTO', start: 'Apr 1, 2025', end: '—', rateSummary: 'Per-unit metered', staffCount: 1 },
  { id: 'k5', name: 'Brand & Design Sprint', clientId: 'c_evergreen', client: 'Evergreen EdTech', type: 'HOURLY', status: 'PAUSED', approval: 'MANUAL', start: 'May 5, 2025', end: 'Aug 5, 2025', rateSummary: '₹1,500 / hr', staffCount: 1 },
];

export const INITIAL_EVENTS: UsageEvent[] = [
  { id: 'e1', contractId: 'k1', client: 'Acme Retail', clientId: 'c_acme', staff: 'Priya Sharma', type: 'HOURLY', unit: 'Senior Developer', qty: 6.5, amount: 1625000, status: 'PENDING', date: 'Jun 23, 2025', desc: 'Checkout flow + payment gateway integration' },
  { id: 'e2', contractId: 'k1', client: 'Acme Retail', clientId: 'c_acme', staff: 'Rohan Mehta', type: 'HOURLY', unit: 'Designer', qty: 4, amount: 600000, status: 'PENDING', date: 'Jun 23, 2025', desc: 'Product detail page redesign' },
  { id: 'e3', contractId: 'k3', client: 'Cedar Health', clientId: 'c_cedar', staff: 'Priya Sharma', type: 'MILESTONE', unit: 'UI/UX Design', qty: 1, amount: 5000000, status: 'PENDING', date: 'Jun 22, 2025', desc: 'UI/UX design milestone — delivered & signed off' },
  { id: 'e4', contractId: 'k1', client: 'Acme Retail', clientId: 'c_acme', staff: 'Priya Sharma', type: 'HOURLY', unit: 'Senior Developer', qty: 10, amount: 2500000, status: 'BILLED', date: 'Jun 10, 2025', desc: 'Payment reconciliation service' },
  { id: 'e5', contractId: 'k1', client: 'Acme Retail', clientId: 'c_acme', staff: 'Anjali Nair', type: 'HOURLY', unit: 'Junior Developer', qty: 20, amount: 2000000, status: 'BILLED', date: 'Jun 18, 2025', desc: 'Admin dashboard CRUD screens' },
  { id: 'e6', contractId: 'k4', client: 'Delta Media', clientId: 'c_delta', staff: 'System', type: 'METERED', unit: 'API Calls', qty: 128, amount: 1280000, status: 'BILLED', date: 'Jun 20, 2025', desc: 'Month-end metered API usage' },
  { id: 'e7', contractId: 'k1', client: 'Acme Retail', clientId: 'c_acme', staff: 'Rohan Mehta', type: 'HOURLY', unit: 'Designer', qty: 8, amount: 1200000, status: 'REJECTED', date: 'Jun 15, 2025', desc: 'Marketing microsite design', reason: 'Out of contract scope — bill on a separate engagement' },
];

export const INITIAL_BALANCES: Record<string, number> = {
  c_acme: 48250000,
  c_bluewave: 1230000,
  c_cedar: 19500000,
  c_delta: -840000,
  c_evergreen: 33000000,
};

export const ACME_LEDGER: LedgerEntry[] = [
  { date: 'Jun 22, 2025', type: 'DEBIT', desc: 'Metered usage — month-end adjustment', amount: 675000, balance: 48250000 },
  { date: 'Jun 21, 2025', type: 'DEBIT', desc: 'Senior Developer · 6.5h — Priya Sharma', amount: 1625000, balance: 48925000 },
  { date: 'Jun 20, 2025', type: 'DEBIT', desc: 'Designer · 8h — Rohan Mehta', amount: 1200000, balance: 50550000 },
  { date: 'Jun 18, 2025', type: 'DEBIT', desc: 'Junior Developer · 20h — Anjali Nair', amount: 2000000, balance: 51750000 },
  { date: 'Jun 14, 2025', type: 'ADJUSTMENT', desc: 'Goodwill credit — service delay', amount: 350000, balance: 53750000 },
  { date: 'Jun 10, 2025', type: 'DEBIT', desc: 'Senior Developer · 10h — Priya Sharma', amount: 2500000, balance: 53400000 },
  { date: 'Jun 01, 2025', type: 'CREDIT', desc: 'Top-up via Bank Transfer', amount: 30000000, balance: 55900000 },
  { date: 'May 24, 2025', type: 'DEBIT', desc: 'Junior Developer · 12h — Anjali Nair', amount: 1200000, balance: 25900000 },
  { date: 'May 16, 2025', type: 'DEBIT', desc: 'Designer · 6h — Rohan Mehta', amount: 900000, balance: 27100000 },
  { date: 'May 09, 2025', type: 'DEBIT', desc: 'Senior Developer · 8h — Priya Sharma', amount: 2000000, balance: 28000000 },
  { date: 'May 02, 2025', type: 'CREDIT', desc: 'Top-up via UPI', amount: 30000000, balance: 30000000 },
];

export interface ContractRateConfig {
  kind: 'roles' | 'sub' | 'milestones' | 'units';
  rows?: Array<{ label: string; key: string; sub?: string; amount: number; done?: boolean }>;
  amount?: number;
  interval?: string;
  day?: number;
}

export const CONTRACT_RATES: Record<string, ContractRateConfig> = {
  k1: { kind: 'roles', rows: [
    { label: 'Senior Developer', key: 'senior_dev', sub: 'per hour', amount: 250000 },
    { label: 'Junior Developer', key: 'junior_dev', sub: 'per hour', amount: 100000 },
    { label: 'Designer', key: 'designer', sub: 'per hour', amount: 150000 },
  ]},
  k2: { kind: 'sub', amount: 1000000, interval: 'monthly', day: 1 },
  k3: { kind: 'milestones', rows: [
    { label: 'UI/UX Design', key: 'm_design', amount: 5000000, done: true },
    { label: 'Backend Development', key: 'm_backend', amount: 12000000, done: false },
    { label: 'Launch & QA', key: 'm_launch', amount: 6000000, done: false },
  ]},
  k4: { kind: 'units', rows: [
    { label: 'API Calls', key: 'api_call', sub: 'per 1,000 calls', amount: 10000 },
    { label: 'Storage', key: 'gb_storage', sub: 'per GB / month', amount: 5000 },
    { label: 'Deployment', key: 'deploy', sub: 'per deploy', amount: 50000 },
  ]},
  k5: { kind: 'roles', rows: [
    { label: 'Designer', key: 'designer', sub: 'per hour', amount: 150000 },
  ]},
};

export function getUnitOptions(contractId: string) {
  const r = CONTRACT_RATES[contractId] || CONTRACT_RATES.k1;
  if (r.kind === 'milestones') return (r.rows || []).map(x => ({ key: x.key, label: x.label, amount: x.amount, isMilestone: true, rate: 0 }));
  return (r.rows || []).map(x => ({ key: x.key, label: x.label, rate: x.amount, isMilestone: false, amount: 0 }));
}

// Formatters
export function money(paise: number, decimals = false): string {
  const v = Math.abs(paise) / 100;
  return '₹' + new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(v);
}

export function initials(name: string): string {
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export function typeChip(t: ContractType) {
  const m: Record<ContractType, { label: string; bg: string; fg: string }> = {
    HOURLY: { label: 'Hourly', bg: '#eaf1fe', fg: '#1f6feb' },
    MILESTONE: { label: 'Milestone', bg: '#efecfb', fg: '#6b4ee0' },
    SUBSCRIPTION: { label: 'Subscription', bg: '#e0f2f0', fg: '#0c7a72' },
    METERED: { label: 'Metered', bg: '#fbf0d9', fg: '#8a5d08' },
  };
  return m[t];
}

export function walletStatus(balance: number, threshold: number) {
  if (balance < 0) return { label: 'Negative', bg: '#fbe9e7', fg: '#b5362b', key: 'NEGATIVE' as const };
  if (balance <= threshold) return { label: 'Low balance', bg: '#fbf0d9', fg: '#8a5d08', key: 'LOW' as const };
  return { label: 'Healthy', bg: '#e3f3ec', fg: '#0c6b4a', key: 'HEALTHY' as const };
}

export function evStatusChip(s: string) {
  const m: Record<string, { label: string; bg: string; fg: string }> = {
    PENDING: { label: 'Pending', bg: '#fbf0d9', fg: '#8a5d08' },
    BILLED: { label: 'Billed', bg: '#e3f3ec', fg: '#0c6b4a' },
    REJECTED: { label: 'Rejected', bg: '#eef0f3', fg: '#7a8190' },
  };
  return m[s] || m.PENDING;
}

export function qtyLabel(ev: UsageEvent): string {
  if (ev.type === 'HOURLY') return `${ev.qty} hrs`;
  if (ev.type === 'MILESTONE') return '1 milestone';
  return `${ev.qty} units`;
}
