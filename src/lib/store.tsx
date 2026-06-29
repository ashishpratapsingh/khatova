import { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { fmtDate } from '../data';
import type {
  AppState, Route, Portal, Profile, ClientMeta, Contract, UsageEvent,
  LedgerEntry, ContractRateConfig, UserRow, ContractType, ApprovalMode, WalletPolicy,
} from '../types';

type ApprovalMode2 = 'MANUAL' | 'AUTO';

// --- DB row mappers --------------------------------------------------------
function mapClient(r: any): ClientMeta {
  return {
    id: r.id, company: r.company, contact: r.contact, email: r.email,
    initials: r.initials, threshold: r.threshold_paise, policy: r.policy as WalletPolicy,
    last: '—', balance: r.balance_paise,
  };
}
function mapContract(r: any): Contract {
  return {
    id: r.id, name: r.name, clientId: r.client_id, client: r.client_company,
    type: r.type as ContractType, status: r.status, approval: r.approval as ApprovalMode2,
    start: fmtDate(r.start_date), end: fmtDate(r.end_date),
    rateSummary: r.rate_summary, staffCount: r.staff_count,
  };
}
function mapEvent(r: any): UsageEvent {
  return {
    id: r.id, contractId: r.contract_id, client: r.client_company, clientId: r.client_id,
    staff: r.staff_name, type: r.type as ContractType, unit: r.unit, qty: Number(r.qty),
    amount: r.amount_paise, status: r.status, date: fmtDate(r.event_date),
    desc: r.description, reason: r.reason ?? undefined,
  };
}
function mapLedger(r: any): LedgerEntry {
  return {
    date: fmtDate(r.created_at), type: r.entry_type, desc: r.description,
    amount: r.amount_paise, balance: r.balance_paise, neg: r.neg,
  };
}
function groupRates(rows: any[]): Record<string, ContractRateConfig> {
  const out: Record<string, ContractRateConfig> = {};
  for (const r of rows) {
    const kind = r.kind as ContractRateConfig['kind'];
    if (!out[r.contract_id]) out[r.contract_id] = { kind, rows: [] };
    const cfg = out[r.contract_id];
    cfg.kind = kind;
    if (kind === 'sub') {
      cfg.amount = r.amount_paise; cfg.interval = r.interval ?? undefined; cfg.day = r.day ?? undefined;
    }
    cfg.rows!.push({ label: r.label, key: r.rate_key, sub: r.sub ?? undefined, amount: r.amount_paise, done: r.done });
  }
  return out;
}

// --- Context shape ---------------------------------------------------------
interface AppApi {
  state: AppState;
  session: Session | null;
  profile: Profile | null;
  portal: Portal | null;
  authLoading: boolean;
  authError: string | null;
  // search
  search: string;
  setSearch: (q: string) => void;
  // notifications read-state
  readNotifs: string[];
  markNotifsRead: (ids: string[]) => void;
  // auth
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // nav
  go: (route: Route) => void;
  openClient: (id: string) => void;
  openContract: (id: string) => void;
  setClientTab: (t: AppState['clientTab']) => void;
  setNewType: (t: ContractType) => void;
  setLogContract: (id: string) => void;
  update: <K extends keyof AppState>(key: K, val: AppState[K]) => void;
  // modals
  openTopup: (id: string) => void;
  openAdjust: (id: string) => void;
  openReject: (ev: { id: string; staff: string; desc: string; amountFmt: string }) => void;
  openAddUser: () => void;
  openNewClient: () => void;
  openEditClient: (id: string) => void;
  closeModal: () => void;
  // mutations
  flash: (msg: string, tone?: 'ok' | 'warn') => void;
  topup: (clientId: string, amountPaise: number, method: string, ref: string) => Promise<void>;
  adjust: (clientId: string, amountPaise: number, dir: 'credit' | 'debit', reason: string) => Promise<void>;
  approve: (eventId: string) => Promise<void>;
  reject: (eventId: string, reason: string) => Promise<void>;
  logUsage: (p: { contractId: string; unit: string; qty: number; amount: number; type: ContractType; desc: string }) => Promise<void>;
  createContract: (p: CreateContractInput) => Promise<void>;
  inviteUser: (p: { email: string; password: string; name: string; role: 'admin' | 'staff' | 'client'; client: string | null }) => Promise<void>;
  createClient: (p: { company: string; contact: string; email: string; threshold: number; policy: WalletPolicy }) => Promise<void>;
  updateClient: (id: string, p: { company: string; contact: string; email: string; threshold: number; policy: WalletPolicy }) => Promise<void>;
  deleteClients: (ids: string[]) => Promise<void>;
}

export interface CreateContractInput {
  name: string; clientId: string; type: ContractType; approval: ApprovalMode;
  start: string; end: string | null; rateSummary: string;
  rates: Array<{ kind: string; label: string; rate_key: string; sub?: string; amount_paise: number; done?: boolean; interval?: string; day?: number }>;
}

const Ctx = createContext<AppApi | null>(null);
export const useApp = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used within AppProvider');
  return v;
};

const EMPTY: Pick<AppState, 'balances' | 'events' | 'ledgers' | 'clients' | 'contracts' | 'ratesByContract' | 'users'> = {
  balances: {}, events: [], ledgers: {}, clients: [], contracts: [], ratesByContract: {}, users: [],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // nav / ui state
  const [route, setRoute] = useState<Route>('login');
  const [modal, setModal] = useState<AppState['modal']>(null);
  const [modalData, setModalData] = useState<Record<string, any>>({});
  const [clientTab, setClientTabState] = useState<AppState['clientTab']>('overview');
  const [selClient, setSelClient] = useState('');
  const [selContract, setSelContract] = useState('');
  const [newType, setNewTypeState] = useState<ContractType>('HOURLY');
  const [logContract, setLogContract] = useState('');
  const [logUnit, setLogUnit] = useState('');
  const [logQty, setLogQty] = useState('6');
  const [search, setSearch] = useState('');
  const [readNotifs, setReadNotifs] = useState<string[]>([]);
  const [toast, setToast] = useState<AppState['toast']>(null);

  const markNotifsRead = useCallback((ids: string[]) => {
    setReadNotifs(prev => Array.from(new Set([...prev, ...ids])));
  }, []);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- session bootstrap ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // load profile whenever session changes
  useEffect(() => {
    if (!session) { setProfile(null); setRoute('login'); return; }
    supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => {
      if (data) {
        setProfile(data as Profile);
        const home: Record<Portal, Route> = { admin: 'admin.dashboard', staff: 'staff.dashboard', client: 'client.dashboard' };
        setRoute(prev => (prev === 'login' ? home[(data as Profile).role] : prev));
      }
    });
  }, [session]);

  const portal: Portal | null = profile?.role ?? null;
  const enabled = !!session && !!profile;

  // --- data queries (RLS scopes rows to the signed-in role) ---
  const clientsQ = useQuery({ queryKey: ['clients'], enabled, queryFn: async () => {
    const { data, error } = await supabase.from('clients').select('*').order('company');
    if (error) throw error; return (data || []).map(mapClient);
  }});
  const contractsQ = useQuery({ queryKey: ['contracts'], enabled, queryFn: async () => {
    const { data, error } = await supabase.from('contracts').select('*').order('created_at');
    if (error) throw error; return (data || []).map(mapContract);
  }});
  const ratesQ = useQuery({ queryKey: ['rates'], enabled, queryFn: async () => {
    const { data, error } = await supabase.from('contract_rates').select('*').order('sort');
    if (error) throw error; return groupRates(data || []);
  }});
  const eventsQ = useQuery({ queryKey: ['events'], enabled, queryFn: async () => {
    const { data, error } = await supabase.from('usage_events').select('*').order('event_date', { ascending: false });
    if (error) throw error; return (data || []).map(mapEvent);
  }});
  const ledgerQ = useQuery({ queryKey: ['ledger'], enabled, queryFn: async () => {
    const { data, error } = await supabase.from('ledger_entries').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    const by: Record<string, LedgerEntry[]> = {};
    for (const r of data || []) { (by[r.client_id] ||= []).push(mapLedger(r)); }
    return by;
  }});
  const usersQ = useQuery({ queryKey: ['users'], enabled: enabled && portal === 'admin', queryFn: async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('role');
    if (error) throw error;
    return (data || []).map((r: any): UserRow => ({
      id: r.id, name: r.full_name, email: r.email,
      role: String(r.role).toUpperCase() as UserRow['role'], initials: r.initials,
    }));
  }});

  const clients = clientsQ.data ?? [];
  const balances: Record<string, number> = {};
  for (const c of clients) balances[c.id] = c.balance;

  const state: AppState = {
    route, modal, modalData, clientTab, selClient, selContract, newType,
    logContract, logUnit, logQty,
    topAmount: '', topMethod: 'UPI', topRef: '', adjAmount: '', adjDir: 'credit',
    adjReason: '', rejectReason: '', toast,
    ...EMPTY,
    balances,
    events: eventsQ.data ?? [],
    ledgers: ledgerQ.data ?? {},
    clients,
    contracts: contractsQ.data ?? [],
    ratesByContract: ratesQ.data ?? {},
    users: usersQ.data ?? [],
    loading: clientsQ.isLoading || contractsQ.isLoading,
  };

  const invalidate = useCallback((keys: string[]) => {
    keys.forEach(k => qc.invalidateQueries({ queryKey: [k] }));
  }, [qc]);

  const flash = useCallback((msg: string, tone: 'ok' | 'warn' = 'ok') => {
    setToast({ msg, tone });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2800);
  }, []);

  // --- auth ---
  const login = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) { setAuthError(error.message); throw error; }
  }, []);
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null); setRoute('login'); setReadNotifs([]); qc.clear();
  }, [qc]);

  // --- nav ---
  const go = useCallback((r: Route) => { setRoute(r); setModal(null); setSearch(''); }, []);
  const openClient = useCallback((id: string) => { setSelClient(id); setClientTabState('overview'); setRoute('admin.clientDetail'); setModal(null); }, []);
  const openContract = useCallback((id: string) => { setSelContract(id); setRoute('admin.contractDetail'); setModal(null); }, []);
  const setClientTab = useCallback((t: AppState['clientTab']) => setClientTabState(t), []);
  const setNewType = useCallback((t: ContractType) => setNewTypeState(t), []);
  const update = useCallback(<K extends keyof AppState>(key: K, val: AppState[K]) => {
    if (key === 'logUnit') setLogUnit(val as string);
    else if (key === 'logQty') setLogQty(val as string);
    else if (key === 'logContract') setLogContract(val as string);
  }, []);

  // --- modals ---
  const clientById = useCallback((id: string) => clients.find(c => c.id === id), [clients]);
  const openTopup = useCallback((id: string) => {
    const c = clientById(id);
    setModalData({ id, clientId: id, company: c?.company ?? '', balance: c?.balance ?? 0 });
    setModal('topup');
  }, [clientById]);
  const openAdjust = useCallback((id: string) => {
    const c = clientById(id);
    setModalData({ id, clientId: id, company: c?.company ?? '', balance: c?.balance ?? 0 });
    setModal('adjust');
  }, [clientById]);
  const openReject = useCallback((ev: { id: string; staff: string; desc: string; amountFmt: string }) => {
    setModalData({ ...ev }); setModal('reject');
  }, []);
  const openAddUser = useCallback(() => { setModalData({}); setModal('adduser'); }, []);
  const openNewClient = useCallback(() => { setModalData({}); setModal('newclient'); }, []);
  const openEditClient = useCallback((id: string) => {
    const c = clientById(id);
    if (!c) return;
    setModalData({ id, company: c.company, contact: c.contact, email: c.email, threshold: c.threshold, policy: c.policy });
    setModal('editclient');
  }, [clientById]);
  const closeModal = useCallback(() => setModal(null), []);

  // --- mutations ---
  const topup = useCallback(async (clientId: string, amount: number, method: string, ref: string) => {
    const { error } = await supabase.rpc('topup_wallet', { p_client: clientId, p_amount: amount, p_method: method, p_ref: ref });
    if (error) { flash(error.message, 'warn'); throw error; }
    invalidate(['clients', 'ledger']); setModal(null);
    flash('Funds added to wallet');
  }, [flash, invalidate]);

  const adjust = useCallback(async (clientId: string, amount: number, dir: 'credit' | 'debit', reason: string) => {
    const { error } = await supabase.rpc('adjust_wallet', { p_client: clientId, p_amount: amount, p_dir: dir, p_reason: reason });
    if (error) { flash(error.message, 'warn'); throw error; }
    invalidate(['clients', 'ledger']); setModal(null);
    flash('Adjustment posted');
  }, [flash, invalidate]);

  const approve = useCallback(async (eventId: string) => {
    const { error } = await supabase.rpc('approve_event', { p_event: eventId });
    if (error) { flash(error.message, 'warn'); throw error; }
    invalidate(['events', 'clients', 'ledger']);
    flash('Usage event billed');
  }, [flash, invalidate]);

  const reject = useCallback(async (eventId: string, reason: string) => {
    const { error } = await supabase.rpc('reject_event', { p_event: eventId, p_reason: reason });
    if (error) { flash(error.message, 'warn'); throw error; }
    invalidate(['events']); setModal(null);
    flash('Usage event rejected', 'warn');
  }, [flash, invalidate]);

  const logUsage = useCallback(async (p: { contractId: string; unit: string; qty: number; amount: number; type: ContractType; desc: string }) => {
    const { error } = await supabase.rpc('log_usage', {
      p_contract: p.contractId, p_unit: p.unit, p_qty: p.qty, p_amount: p.amount, p_type: p.type, p_desc: p.desc,
    });
    if (error) { flash(error.message, 'warn'); throw error; }
    invalidate(['events', 'clients', 'ledger']);
    flash('Usage event submitted'); setRoute('staff.history');
  }, [flash, invalidate]);

  const createContract = useCallback(async (p: CreateContractInput) => {
    const { error } = await supabase.rpc('create_contract', {
      p_name: p.name, p_client: p.clientId, p_type: p.type, p_approval: p.approval,
      p_start: p.start, p_end: p.end, p_rate_summary: p.rateSummary, p_rates: p.rates,
    });
    if (error) { flash(error.message, 'warn'); throw error; }
    invalidate(['contracts', 'rates']);
    flash('Contract created'); setRoute('admin.contracts');
  }, [flash, invalidate]);

  const inviteUser = useCallback(async (p: { email: string; password: string; name: string; role: 'admin' | 'staff' | 'client'; client: string | null }) => {
    const { error } = await supabase.rpc('invite_user', {
      p_email: p.email, p_password: p.password, p_name: p.name, p_role: p.role, p_client: p.client,
    });
    if (error) { flash(error.message, 'warn'); throw error; }
    invalidate(['users']); setModal(null);
    flash('User account created');
  }, [flash, invalidate]);

  const createClient = useCallback(async (p: { company: string; contact: string; email: string; threshold: number; policy: WalletPolicy }) => {
    const { error } = await supabase.rpc('create_client', {
      p_company: p.company, p_contact: p.contact, p_email: p.email, p_threshold: p.threshold, p_policy: p.policy,
    });
    if (error) { flash(error.message, 'warn'); throw error; }
    invalidate(['clients']); setModal(null);
    flash('Client created');
  }, [flash, invalidate]);

  const updateClient = useCallback(async (id: string, p: { company: string; contact: string; email: string; threshold: number; policy: WalletPolicy }) => {
    const { error } = await supabase.rpc('update_client', {
      p_id: id, p_company: p.company, p_contact: p.contact, p_email: p.email, p_threshold: p.threshold, p_policy: p.policy,
    });
    if (error) { flash(error.message, 'warn'); throw error; }
    invalidate(['clients']); setModal(null);
    flash('Client updated');
  }, [flash, invalidate]);

  const deleteClients = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return;
    const { error } = await supabase.rpc('delete_clients', { p_ids: ids });
    if (error) { flash(error.message, 'warn'); throw error; }
    invalidate(['clients', 'contracts', 'rates', 'events', 'ledger']);
    flash(`${ids.length} client${ids.length === 1 ? '' : 's'} deleted`, 'warn');
  }, [flash, invalidate]);

  const api: AppApi = {
    state, session, profile, portal, authLoading, authError,
    search, setSearch, readNotifs, markNotifsRead,
    login, logout, go, openClient, openContract, setClientTab, setNewType, setLogContract, update,
    openTopup, openAdjust, openReject, openAddUser, openNewClient, openEditClient, closeModal,
    flash, topup, adjust, approve, reject, logUsage, createContract, inviteUser, createClient, updateClient, deleteClients,
  };
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
