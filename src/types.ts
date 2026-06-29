export type Portal = 'admin' | 'staff' | 'client';
export type Route =
  | 'login'
  | 'admin.dashboard' | 'admin.clients' | 'admin.clientDetail'
  | 'admin.contracts' | 'admin.contractDetail' | 'admin.newContract'
  | 'admin.approvals' | 'admin.reports' | 'admin.users'
  | 'staff.dashboard' | 'staff.log' | 'staff.history'
  | 'client.dashboard' | 'client.statement' | 'client.contracts';

export type ContractType = 'HOURLY' | 'MILESTONE' | 'SUBSCRIPTION' | 'METERED';
export type ApprovalMode = 'MANUAL' | 'AUTO';
export type EventStatus = 'PENDING' | 'BILLED' | 'REJECTED';
export type ClientStatus = 'HEALTHY' | 'LOW' | 'NEGATIVE';
export type WalletPolicy = 'BLOCK' | 'ALLOW' | 'PAUSE';
export type Currency = 'INR' | 'USD' | 'AED' | 'GBP';
export type Modal = 'topup' | 'adjust' | 'reject' | 'adduser' | 'newclient' | 'editclient' | null;

export interface ClientMeta {
  id: string;
  company: string;
  contact: string;
  email: string;
  initials: string;
  threshold: number;
  policy: WalletPolicy;
  last: string;
  balance: number;
  currency: Currency;
  mobile: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'CLIENT';
  initials: string;
}

export interface ContractRateConfig {
  kind: 'roles' | 'sub' | 'milestones' | 'units';
  rows?: Array<{ label: string; key: string; sub?: string; amount: number; done?: boolean }>;
  amount?: number;
  interval?: string;
  day?: number;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: Portal;
  client_id: string | null;
  initials: string;
}

export interface Contract {
  id: string;
  name: string;
  clientId: string;
  client: string;
  type: ContractType;
  status: 'ACTIVE' | 'PAUSED' | 'ENDED';
  approval: 'MANUAL' | 'AUTO';
  start: string;
  end: string;
  rateSummary: string;
  staffCount: number;
}

export interface UsageEvent {
  id: string;
  contractId: string;
  client: string;
  clientId: string;
  staff: string;
  type: ContractType;
  unit: string;
  qty: number;
  amount: number;
  status: EventStatus;
  date: string;
  desc: string;
  reason?: string;
}

export interface LedgerEntry {
  date: string;
  type: 'CREDIT' | 'DEBIT' | 'ADJUSTMENT';
  desc: string;
  amount: number;
  balance: number;
  neg?: boolean;
}

export interface AppState {
  route: Route;
  modal: Modal;
  modalData: Record<string, any>;
  clientTab: 'overview' | 'ledger' | 'contracts' | 'settings';
  selClient: string;
  selContract: string;
  newType: ContractType;
  logContract: string;
  logUnit: string;
  logQty: string;
  topAmount: string;
  topMethod: string;
  topRef: string;
  adjAmount: string;
  adjDir: 'credit' | 'debit';
  adjReason: string;
  rejectReason: string;
  toast: { msg: string; tone: 'ok' | 'warn' } | null;
  // Live data folded in from the backend
  balances: Record<string, number>;
  events: UsageEvent[];
  ledgers: Record<string, LedgerEntry[]>;
  clients: ClientMeta[];
  contracts: Contract[];
  ratesByContract: Record<string, ContractRateConfig>;
  users: UserRow[];
  loading: boolean;
}
