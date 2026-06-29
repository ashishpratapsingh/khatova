import { useState, useCallback, useRef } from 'react';
import type { AppState, Route, LedgerEntry } from './types';
import { INITIAL_EVENTS, INITIAL_BALANCES, ACME_LEDGER, money } from './data';

const INITIAL_STATE: AppState = {
  route: 'login',
  modal: null,
  modalData: {},
  clientTab: 'overview',
  selClient: 'c_acme',
  selContract: 'k1',
  newType: 'HOURLY',
  logContract: 'k1',
  logUnit: 'senior_dev',
  logQty: '6',
  topAmount: '',
  topMethod: 'UPI',
  topRef: '',
  adjAmount: '',
  adjDir: 'credit',
  adjReason: '',
  rejectReason: '',
  toast: null,
  balances: { ...INITIAL_BALANCES },
  events: [...INITIAL_EVENTS],
  ledgers: { c_acme: [...ACME_LEDGER] },
};

export function useAppState() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback((route: Route) => {
    setState(s => ({ ...s, route, modal: null }));
  }, []);

  const goPortal = useCallback((portal: 'admin' | 'staff' | 'client') => {
    const map = { admin: 'admin.dashboard' as Route, staff: 'staff.dashboard' as Route, client: 'client.dashboard' as Route };
    setState(s => ({ ...s, route: map[portal], modal: null }));
  }, []);

  const logout = useCallback(() => setState(s => ({ ...s, route: 'login', modal: null })), []);

  const openClient = useCallback((id: string) => {
    setState(s => ({ ...s, selClient: id, clientTab: 'overview', route: 'admin.clientDetail', modal: null }));
  }, []);

  const openContract = useCallback((id: string) => {
    setState(s => ({ ...s, selContract: id, route: 'admin.contractDetail', modal: null }));
  }, []);

  const closeModal = useCallback(() => setState(s => ({ ...s, modal: null })), []);

  const openTopup = useCallback((id: string) => {
    setState(s => {
      const bal = s.balances[id] || 0;
      const clients = [
        { id: 'c_acme', company: 'Acme Retail' },
        { id: 'c_bluewave', company: 'Bluewave Logistics' },
        { id: 'c_cedar', company: 'Cedar Health' },
        { id: 'c_delta', company: 'Delta Media' },
        { id: 'c_evergreen', company: 'Evergreen EdTech' },
      ];
      const c = clients.find(x => x.id === id)!;
      return { ...s, modal: 'topup', modalData: { id, company: c.company, balance: bal }, topAmount: '', topMethod: 'UPI', topRef: '' };
    });
  }, []);

  const openAdjust = useCallback((id: string) => {
    setState(s => {
      const bal = s.balances[id] || 0;
      const clients = [
        { id: 'c_acme', company: 'Acme Retail' },
        { id: 'c_bluewave', company: 'Bluewave Logistics' },
        { id: 'c_cedar', company: 'Cedar Health' },
        { id: 'c_delta', company: 'Delta Media' },
        { id: 'c_evergreen', company: 'Evergreen EdTech' },
      ];
      const c = clients.find(x => x.id === id)!;
      return { ...s, modal: 'adjust', modalData: { id, company: c.company, balance: bal }, adjAmount: '', adjDir: 'credit', adjReason: '' };
    });
  }, []);

  const openReject = useCallback((ev: { id: string; staff: string; desc: string; amountFmt: string }) => {
    setState(s => ({ ...s, modal: 'reject', modalData: { ...ev }, rejectReason: '' }));
  }, []);

  const openAddUser = useCallback(() => {
    setState(s => ({ ...s, modal: 'adduser', modalData: {} }));
  }, []);

  const flash = useCallback((msg: string, tone: 'ok' | 'warn' = 'ok') => {
    setState(s => ({ ...s, toast: { msg, tone } }));
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setState(s => ({ ...s, toast: null })), 2800);
  }, []);

  const approve = useCallback((id: string) => {
    setState(s => {
      const ev = s.events.find(e => e.id === id);
      if (!ev) return s;
      const events = s.events.map(e => e.id === id ? { ...e, status: 'BILLED' as const } : e);
      const balances = { ...s.balances };
      balances[ev.clientId] = (balances[ev.clientId] || 0) - ev.amount;
      const ledgers = { ...s.ledgers };
      if (ev.clientId === 'c_acme') {
        const row: LedgerEntry = { date: 'Jun 25, 2025', type: 'DEBIT', desc: `Charge: ${ev.desc} — ${ev.staff}`, amount: ev.amount, balance: balances.c_acme };
        ledgers.c_acme = [row, ...(s.ledgers.c_acme || [])];
      }
      return { ...s, events, balances, ledgers };
    });
    setState(s => {
      const ev = s.events.find(e => e.id === id);
      if (ev) {
        // flash after state update
      }
      return s;
    });
    // get amount for flash
    setState(prev => {
      const ev = INITIAL_EVENTS.find(e => e.id === id) || prev.events.find(e => e.id === id);
      if (ev) flash(`${money(ev.amount, false)} billed to ${ev.client}`);
      return prev;
    });
  }, [flash]);

  const submitReject = useCallback(() => {
    setState(s => {
      const id = s.modalData.id;
      const reason = s.rejectReason || 'No reason given';
      return { ...s, events: s.events.map(e => e.id === id ? { ...e, status: 'REJECTED' as const, reason } : e), modal: null };
    });
    flash('Usage event rejected', 'warn');
  }, [flash]);

  const submitTopup = useCallback(() => {
    setState(s => {
      const amt = Math.round((parseFloat(s.topAmount || '0') || 0) * 100);
      if (amt <= 0) { flash('Enter a valid amount', 'warn'); return s; }
      const d = s.modalData;
      const balances = { ...s.balances };
      balances[d.id] = (balances[d.id] || 0) + amt;
      const ledgers = { ...s.ledgers };
      if (d.id === 'c_acme') {
        ledgers.c_acme = [
          { date: 'Jun 25, 2025', type: 'CREDIT', desc: `Top-up via ${s.topMethod}`, amount: amt, balance: balances.c_acme },
          ...(s.ledgers.c_acme || []),
        ];
      }
      flash(`${money(amt, false)} added to ${d.company}`);
      return { ...s, balances, ledgers, modal: null };
    });
  }, [flash]);

  const submitAdjust = useCallback(() => {
    setState(s => {
      const amt = Math.round((parseFloat(s.adjAmount || '0') || 0) * 100);
      if (amt <= 0) { flash('Enter a valid amount', 'warn'); return s; }
      const signed = s.adjDir === 'credit' ? amt : -amt;
      const d = s.modalData;
      const balances = { ...s.balances };
      balances[d.id] = (balances[d.id] || 0) + signed;
      const ledgers = { ...s.ledgers };
      if (d.id === 'c_acme') {
        ledgers.c_acme = [
          { date: 'Jun 25, 2025', type: 'ADJUSTMENT', desc: `Adjustment — ${s.adjReason || 'manual correction'}`, amount: amt, balance: balances.c_acme, neg: s.adjDir !== 'credit' },
          ...(s.ledgers.c_acme || []),
        ];
      }
      flash('Adjustment posted');
      return { ...s, balances, ledgers, modal: null };
    });
  }, [flash]);

  const submitInvite = useCallback(() => {
    setState(s => ({ ...s, modal: null }));
    flash('Invite link sent');
  }, [flash]);

  const setLogContract = useCallback((id: string) => {
    setState(s => ({ ...s, logContract: id, logUnit: '' }));
  }, []);

  const submitLog = useCallback(() => {
    flash('Usage event submitted for approval');
    setState(s => ({ ...s, route: 'staff.history' }));
  }, [flash]);

  const setNewType = useCallback((t: AppState['newType']) => setState(s => ({ ...s, newType: t })), []);
  const setClientTab = useCallback((t: AppState['clientTab']) => setState(s => ({ ...s, clientTab: t })), []);

  const update = useCallback(<K extends keyof AppState>(key: K, val: AppState[K]) => {
    setState(s => ({ ...s, [key]: val }));
  }, []);

  return {
    state,
    go,
    goPortal,
    logout,
    openClient,
    openContract,
    closeModal,
    openTopup,
    openAdjust,
    openReject,
    openAddUser,
    flash,
    approve,
    submitReject,
    submitTopup,
    submitAdjust,
    submitInvite,
    setLogContract,
    submitLog,
    setNewType,
    setClientTab,
    update,
  };
}
