import { useState } from 'react';
import { ModalShell, MRow } from './Modal';
import { money, CURRENCIES } from '../data';
import type { ClientMeta, WalletPolicy, Currency } from '../types';

const inputStyle = { width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 13.5, boxSizing: 'border-box' as const };

// Top-up modal -------------------------------------------------------------
export function TopupModal({ data, onClose, onSubmit }: {
  data: Record<string, any>; onClose: () => void;
  onSubmit: (amountPaise: number, method: string, ref: string) => Promise<void>;
}) {
  const bal = data.balance ?? 0;
  const cur: Currency = data.currency ?? 'INR';
  const sym = CURRENCIES[cur].symbol.trim();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Bank Transfer');
  const [ref, setRef] = useState('');
  const [busy, setBusy] = useState(false);
  const amt = Math.round((parseFloat(amount || '0') || 0) * 100);

  const submit = async () => {
    if (busy || amt <= 0) return;
    setBusy(true);
    try { await onSubmit(amt, method, ref); } finally { setBusy(false); }
  };

  return (
    <ModalShell title="Add funds" onClose={onClose}>
      <p style={{ fontSize: 13, color: '#687184', margin: '2px 0 20px' }}>
        Credit the wallet for <strong>{data.company}</strong>
      </p>

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Amount ({sym})</label>
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
        style={{ ...inputStyle, fontSize: 17, fontWeight: 700, fontFamily: "'IBM Plex Mono'", marginBottom: 14 }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
        {[1000, 5000, 25000].map(v => (
          <button key={v} onClick={() => setAmount(String(v))}
            style={{ height: 36, border: '1px solid #dcdfe6', background: '#f8f9fb', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#3f4654' }}>{money(v * 100, false, cur)}</button>
        ))}
      </div>

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Payment method</label>
      <select value={method} onChange={e => setMethod(e.target.value)} style={{ ...inputStyle, background: '#fff', marginBottom: 14 }}>
        <option>Bank Transfer</option>
        <option>UPI</option>
        <option>Card</option>
      </select>

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Reference / UTR</label>
      <input value={ref} onChange={e => setRef(e.target.value)} placeholder="UTR or transaction ref"
        style={{ ...inputStyle, marginBottom: 18 }} />

      <div style={{ background: '#f5f9ff', border: '1px solid #d8e6fd', borderRadius: 10, padding: '12px 14px', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <MRow label="Current balance">{money(bal, false, cur)}</MRow>
        <MRow label="Top-up amount">+{money(amt, false, cur)}</MRow>
        <div style={{ borderTop: '1px solid #d8e6fd', margin: '4px 0' }} />
        <MRow label="New balance"><span style={{ color: '#1f6feb' }}>{money(bal + amt, false, cur)}</span></MRow>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, height: 42, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
        <button onClick={submit} disabled={busy || amt <= 0} style={{ flex: 2, height: 42, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: busy || amt <= 0 ? 0.6 : 1, boxShadow: '0 4px 12px rgba(31,111,235,.25)' }}>Confirm top-up</button>
      </div>
    </ModalShell>
  );
}

// Adjust modal -------------------------------------------------------------
export function AdjustModal({ data, onClose, onSubmit }: {
  data: Record<string, any>; onClose: () => void;
  onSubmit: (amountPaise: number, dir: 'credit' | 'debit', reason: string) => Promise<void>;
}) {
  const bal = data.balance ?? 0;
  const cur: Currency = data.currency ?? 'INR';
  const sym = CURRENCIES[cur].symbol.trim();
  const [amount, setAmount] = useState('');
  const [dir, setDir] = useState<'credit' | 'debit'>('credit');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const amt = Math.round((parseFloat(amount || '0') || 0) * 100);
  const isDebit = dir === 'debit';

  const submit = async () => {
    if (busy || amt <= 0) return;
    setBusy(true);
    try { await onSubmit(amt, dir, reason); } finally { setBusy(false); }
  };

  return (
    <ModalShell title="Manual adjustment" onClose={onClose}>
      <p style={{ fontSize: 13, color: '#687184', margin: '2px 0 20px' }}>
        Apply a credit or debit to <strong>{data.company}</strong>'s wallet
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {(['credit', 'debit'] as const).map(d => (
          <button key={d} onClick={() => setDir(d)}
            style={{ height: 42, border: `2px solid ${dir === d ? '#1f6feb' : '#dcdfe6'}`, background: dir === d ? '#eaf1fe' : '#fff', color: dir === d ? '#1f6feb' : '#3f4654', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>{d}</button>
        ))}
      </div>

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Amount ({sym})</label>
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
        style={{ ...inputStyle, fontSize: 17, fontWeight: 700, fontFamily: "'IBM Plex Mono'", marginBottom: 14 }} />

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Reason</label>
      <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Explain the reason for this adjustment"
        style={{ ...inputStyle, height: 78, padding: '10px 13px', resize: 'none', marginBottom: 18, fontFamily: "'IBM Plex Sans'" }} />

      <div style={{ background: '#f5f9ff', border: '1px solid #d8e6fd', borderRadius: 10, padding: '12px 14px', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <MRow label="Current balance">{money(bal, false, cur)}</MRow>
        <MRow label="Adjustment">{isDebit ? '-' : '+'}{money(amt, false, cur)}</MRow>
        <div style={{ borderTop: '1px solid #d8e6fd', margin: '4px 0' }} />
        <MRow label="New balance"><span style={{ color: '#1f6feb' }}>{money(isDebit ? bal - amt : bal + amt, false, cur)}</span></MRow>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, height: 42, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
        <button onClick={submit} disabled={busy || amt <= 0} style={{ flex: 2, height: 42, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: busy || amt <= 0 ? 0.6 : 1 }}>Apply adjustment</button>
      </div>
    </ModalShell>
  );
}

// Reject modal -------------------------------------------------------------
export function RejectModal({ data, onClose, onSubmit }: {
  data: Record<string, any>; onClose: () => void; onSubmit: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async () => { setBusy(true); try { await onSubmit(reason); } finally { setBusy(false); } };

  return (
    <ModalShell title="Reject usage event" onClose={onClose}>
      <p style={{ fontSize: 13, color: '#687184', margin: '2px 0 16px' }}>
        Rejecting will move this event to the rejected queue and notify the staff member.
      </p>

      <div style={{ background: '#f8f9fb', borderRadius: 10, padding: '12px 14px', marginBottom: 18 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>{data.desc}</div>
        <div style={{ fontSize: 12.5, color: '#687184' }}>by {data.staff} · {data.amountFmt}</div>
      </div>

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Reason for rejection</label>
      <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Explain why this event is being rejected"
        style={{ ...inputStyle, height: 88, padding: '10px 13px', resize: 'none', marginBottom: 20, fontFamily: "'IBM Plex Sans'" }} />

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, height: 42, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
        <button onClick={submit} disabled={busy} style={{ flex: 2, height: 42, background: '#c5362c', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>Confirm rejection</button>
      </div>
    </ModalShell>
  );
}

// Client form (shared by create + edit) ------------------------------------
const POLICIES: Array<{ key: WalletPolicy; label: string; desc: string }> = [
  { key: 'BLOCK', label: 'Block', desc: 'Reject overdraws' },
  { key: 'ALLOW', label: 'Allow', desc: 'Permit negative' },
  { key: 'PAUSE', label: 'Pause', desc: 'Pause on low' },
];

export interface ClientFormValues {
  company: string; contact: string; email: string; threshold: number; policy: WalletPolicy; currency: Currency;
  mobile: string; address1: string; address2: string; city: string; state: string; notifyLowBalance: boolean;
}

function ClientFormModal({ title, intro, submitLabel, initial, existing = [], selfId, onClose, onSubmit }: {
  title: string; intro: string; submitLabel: string;
  initial?: Partial<ClientFormValues> & { threshold?: number };
  existing?: Array<{ id: string; company: string; email: string }>;
  selfId?: string;
  onClose: () => void;
  onSubmit: (p: ClientFormValues) => Promise<void>;
}) {
  const [company, setCompany] = useState(initial?.company ?? '');
  const [contact, setContact] = useState(initial?.contact ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [threshold, setThreshold] = useState(initial?.threshold ? String(initial.threshold / 100) : '');
  const [policy, setPolicy] = useState<WalletPolicy>(initial?.policy ?? 'BLOCK');
  const [currency, setCurrency] = useState<Currency>(initial?.currency ?? 'INR');
  const [mobile, setMobile] = useState(initial?.mobile ?? '');
  const [address1, setAddress1] = useState(initial?.address1 ?? '');
  const [address2, setAddress2] = useState(initial?.address2 ?? '');
  const [city, setCity] = useState(initial?.city ?? '');
  const [stateField, setStateField] = useState(initial?.state ?? '');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<'details' | 'address' | 'policy'>('details');
  const sym = CURRENCIES[currency].symbol.trim();

  const others = existing.filter(c => c.id !== selfId);
  const companyDup = company.trim() !== '' && others.some(c => c.company.trim().toLowerCase() === company.trim().toLowerCase());
  const emailDup = email.trim() !== '' && others.some(c => c.email.trim().toLowerCase() === email.trim().toLowerCase());
  const valid = company.trim().length > 0 && !companyDup && !emailDup;

  const submit = async () => {
    if (busy || !valid) return;
    setBusy(true);
    try {
      await onSubmit({ company, contact, email, threshold: Math.round((parseFloat(threshold || '0') || 0) * 100), policy, currency,
        mobile, address1, address2, city, state: stateField, notifyLowBalance: initial?.notifyLowBalance ?? true });
    } finally { setBusy(false); }
  };

  const dupMsg = (text: string) => (
    <div style={{ fontSize: 12, color: '#b5362b', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: 15 }}>error</span>{text}
    </div>
  );

  const detailsInvalid = company.trim() === '' || companyDup || emailDup;
  const TABS: Array<{ key: typeof tab; label: string; flag?: boolean }> = [
    { key: 'details', label: 'Details', flag: detailsInvalid },
    { key: 'address', label: 'Address' },
    { key: 'policy', label: 'Policy' },
  ];
  const lbl = { display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 } as const;

  return (
    <ModalShell title={title} onClose={onClose} width="540px">
      <p style={{ fontSize: 13, color: '#687184', margin: '2px 0 16px' }}>{intro}</p>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f3f6', borderRadius: 10, padding: 4, marginBottom: 18 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ flex: 1, height: 34, border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: tab === t.key ? '#fff' : 'transparent', color: tab === t.key ? '#161b26' : '#687184',
              boxShadow: tab === t.key ? '0 1px 2px rgba(16,24,40,.12)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {t.label}
            {t.flag && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c5362c' }} />}
          </button>
        ))}
      </div>

      {/* Details tab */}
      {tab === 'details' && (
        <div>
          <label style={lbl}>Company name</label>
          <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Rathore Timber Pvt Ltd"
            style={{ ...inputStyle, marginBottom: companyDup ? 0 : 14, borderColor: companyDup ? '#e0a3a0' : '#dcdfe6' }} />
          {companyDup && dupMsg('A client with this name already exists.')}
          {companyDup && <div style={{ height: 14 }} />}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={lbl}>Contact person</label>
              <input value={contact} onChange={e => setContact(e.target.value)} placeholder="e.g. Vikram Rao" style={inputStyle} />
            </div>
            <div>
              <label style={lbl}>Mobile number</label>
              <input value={mobile} onChange={e => setMobile(e.target.value)} placeholder="e.g. +91 98765 43210" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={lbl}>Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value as Currency)} style={{ ...inputStyle, background: '#fff' }}>
                {(Object.keys(CURRENCIES) as Currency[]).map(c => (
                  <option key={c} value={c}>{CURRENCIES[c].option}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={lbl}>Low-balance alert ({sym})</label>
              <input type="number" value={threshold} onChange={e => setThreshold(e.target.value)} placeholder="0" style={{ ...inputStyle, fontFamily: "'IBM Plex Mono'" }} />
            </div>
          </div>

          <label style={lbl}>Billing email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="billing@company.in"
            style={{ ...inputStyle, marginBottom: emailDup ? 0 : 2, borderColor: emailDup ? '#e0a3a0' : '#dcdfe6' }} />
          {emailDup && dupMsg('A client with this billing email already exists.')}
        </div>
      )}

      {/* Address tab */}
      {tab === 'address' && (
        <div>
          <label style={lbl}>Address line 1</label>
          <input value={address1} onChange={e => setAddress1(e.target.value)} placeholder="Street address, building" style={{ ...inputStyle, marginBottom: 12 }} />

          <label style={lbl}>Address line 2</label>
          <input value={address2} onChange={e => setAddress2(e.target.value)} placeholder="Area, landmark (optional)" style={{ ...inputStyle, marginBottom: 12 }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl}>City</label>
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Mumbai" style={inputStyle} />
            </div>
            <div>
              <label style={lbl}>State</label>
              <input value={stateField} onChange={e => setStateField(e.target.value)} placeholder="e.g. Maharashtra" style={inputStyle} />
            </div>
          </div>
        </div>
      )}

      {/* Policy tab */}
      {tab === 'policy' && (
        <div>
          <label style={{ ...lbl, marginBottom: 8 }}>Negative-balance policy</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {POLICIES.map(p => (
              <button key={p.key} onClick={() => setPolicy(p.key)}
                style={{ padding: '12px 8px', border: policy === p.key ? '2px solid #1f6feb' : '1px solid #dcdfe6', background: policy === p.key ? '#eaf1fe' : '#fff', borderRadius: 10, cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: policy === p.key ? '#1f6feb' : '#161b26' }}>{p.label}</div>
                <div style={{ fontSize: 11, color: '#9aa1ad', marginTop: 2 }}>{p.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', gap: 10, marginTop: 22, paddingTop: 16, borderTop: '1px solid #f2f3f6' }}>
        <button onClick={onClose} style={{ flex: 1, height: 42, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
        <button onClick={submit} disabled={busy || !valid} style={{ flex: 2, height: 42, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: busy || !valid ? 0.6 : 1 }}>{busy ? 'Saving…' : submitLabel}</button>
      </div>
    </ModalShell>
  );
}

export function NewClientModal({ clients, onClose, onSubmit }: { clients: ClientMeta[]; onClose: () => void; onSubmit: (p: ClientFormValues) => Promise<void> }) {
  return <ClientFormModal title="New client" intro="Add a client company. Their wallet starts at ₹0 — top it up afterwards." submitLabel="Create client" existing={clients} onClose={onClose} onSubmit={onSubmit} />;
}

export function EditClientModal({ data, clients, onClose, onSubmit }: { data: Record<string, any>; clients: ClientMeta[]; onClose: () => void; onSubmit: (p: ClientFormValues) => Promise<void> }) {
  return <ClientFormModal title="Edit client" intro="Update this client's details." submitLabel="Save changes" initial={data} existing={clients} selfId={data.id} onClose={onClose} onSubmit={onSubmit} />;
}

// Add user modal -----------------------------------------------------------
export function AddUserModal({ clients, onClose, onSubmit }: {
  clients: ClientMeta[]; onClose: () => void;
  onSubmit: (p: { email: string; password: string; name: string; role: 'admin' | 'staff' | 'client'; client: string | null }) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'staff' | 'client'>('staff');
  const [client, setClient] = useState(clients[0]?.id ?? '');
  const [busy, setBusy] = useState(false);
  const valid = name.trim() && email.trim() && password.length >= 6 && (role !== 'client' || client);

  const submit = async () => {
    if (busy || !valid) return;
    setBusy(true);
    try { await onSubmit({ name, email, password, role, client: role === 'client' ? client : null }); }
    finally { setBusy(false); }
  };

  return (
    <ModalShell title="Create user" onClose={onClose}>
      <p style={{ fontSize: 13, color: '#687184', margin: '2px 0 20px' }}>
        Create a login for a staff member or client contact.
      </p>

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Full name</label>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Priya Sharma" style={{ ...inputStyle, marginBottom: 14 }} />

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Work email</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.in" style={{ ...inputStyle, marginBottom: 14 }} />

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Temporary password</label>
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="min 6 characters" style={{ ...inputStyle, marginBottom: 14 }} />

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 8 }}>Role</label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: role === 'client' ? 14 : 22 }}>
        {([['admin', 'Admin', 'Full access'], ['staff', 'Staff', 'Log usage'], ['client', 'Client', 'View wallet']] as const).map(([r, label, desc]) => (
          <button key={r} onClick={() => setRole(r)}
            style={{ padding: '10px 8px', border: role === r ? '2px solid #1f6feb' : '1px solid #dcdfe6', background: role === r ? '#eaf1fe' : '#fff', borderRadius: 10, cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: role === r ? '#1f6feb' : '#161b26' }}>{label}</div>
            <div style={{ fontSize: 11.5, color: '#9aa1ad', marginTop: 2 }}>{desc}</div>
          </button>
        ))}
      </div>

      {role === 'client' && (
        <>
          <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Client company</label>
          <select value={client} onChange={e => setClient(e.target.value)} style={{ ...inputStyle, background: '#fff', marginBottom: 22 }}>
            {clients.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
          </select>
        </>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, height: 42, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
        <button onClick={submit} disabled={busy || !valid} style={{ flex: 2, height: 42, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: busy || !valid ? 0.6 : 1 }}>Create account</button>
      </div>
    </ModalShell>
  );
}
