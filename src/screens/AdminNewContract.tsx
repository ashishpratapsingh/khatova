import { useState } from 'react';
import { Icon } from '../ui';
import { money } from '../data';
import type { AppState, ContractType, ApprovalMode } from '../types';
import type { CreateContractInput } from '../lib/store';

interface Props {
  state: AppState;
  setNewType: (t: ContractType) => void;
  goContracts: () => void;
  createContract: (p: CreateContractInput) => Promise<void>;
}

const TYPE_CARDS = [
  { key: 'HOURLY', label: 'Hourly', icon: 'schedule', desc: 'Bill by the hour per role' },
  { key: 'MILESTONE', label: 'Milestone', icon: 'flag', desc: 'Fixed amounts per deliverable' },
  { key: 'SUBSCRIPTION', label: 'Subscription', icon: 'autorenew', desc: 'Recurring fixed charge' },
  { key: 'METERED', label: 'Metered', icon: 'speed', desc: 'Per-unit usage billing' },
] as const;

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'item';
const rowInput = { height: 40, border: '1px solid #dcdfe6', borderRadius: 9, padding: '0 12px', fontSize: 13, background: '#fff', boxSizing: 'border-box' as const };

export default function AdminNewContract({ state, setNewType, goContracts, createContract }: Props) {
  const nt = state.newType;
  const [clientId, setClientId] = useState(state.clients[0]?.id ?? '');
  const [name, setName] = useState('');
  const [approval, setApproval] = useState<ApprovalMode>('MANUAL');
  const [start, setStart] = useState(new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);

  // rate rows (amounts in rupees as strings)
  const [roleRows, setRoleRows] = useState([{ label: 'Senior Developer', amt: '2500' }, { label: 'Designer', amt: '1500' }]);
  const [msRows, setMsRows] = useState([{ label: 'UI/UX Design', amt: '50000' }, { label: 'Development', amt: '120000' }]);
  const [unitRows, setUnitRows] = useState([{ label: 'API Calls', amt: '100' }, { label: 'Storage (per GB)', amt: '50' }]);
  const [subAmt, setSubAmt] = useState('10000');
  const [subDay, setSubDay] = useState('1');

  const setRow = (rows: any[], set: (r: any[]) => void, i: number, key: string, val: string) => {
    const next = rows.slice(); next[i] = { ...next[i], [key]: val }; set(next);
  };

  const buildRates = (): CreateContractInput['rates'] => {
    if (nt === 'HOURLY') return roleRows.filter(r => r.label.trim()).map(r => ({ kind: 'roles', label: r.label, rate_key: slug(r.label), sub: 'per hour', amount_paise: Math.round(parseFloat(r.amt || '0') * 100) }));
    if (nt === 'MILESTONE') return msRows.filter(r => r.label.trim()).map(r => ({ kind: 'milestones', label: r.label, rate_key: slug(r.label), amount_paise: Math.round(parseFloat(r.amt || '0') * 100) }));
    if (nt === 'METERED') return unitRows.filter(r => r.label.trim()).map(r => ({ kind: 'units', label: r.label, rate_key: slug(r.label), sub: 'per unit', amount_paise: Math.round(parseFloat(r.amt || '0') * 100) }));
    return [{ kind: 'sub', label: 'Monthly retainer', rate_key: 'retainer', amount_paise: Math.round(parseFloat(subAmt || '0') * 100), interval: 'monthly', day: parseInt(subDay || '1', 10) }];
  };

  const summary = (): string => {
    const rates = buildRates();
    if (nt === 'SUBSCRIPTION') return `${money(rates[0]?.amount_paise || 0, false)} / month`;
    if (nt === 'MILESTONE') return `${rates.length} milestones · ${money(rates.reduce((a, r) => a + r.amount_paise, 0), false)}`;
    if (nt === 'METERED') return 'Per-unit metered';
    const amts = rates.map(r => r.amount_paise);
    return amts.length ? `${money(Math.min(...amts), false)}–${money(Math.max(...amts), false)} / hr` : 'Hourly';
  };

  const valid = clientId && name.trim() && buildRates().length > 0;

  const save = async () => {
    if (!valid || busy) return;
    setBusy(true);
    try {
      await createContract({ name, clientId, type: nt, approval, start, end: null, rateSummary: summary(), rates: buildRates() });
    } finally { setBusy(false); }
  };

  const RowEditor = ({ rows, set, addLabel, suffix }: { rows: any[]; set: (r: any[]) => void; addLabel: string; suffix?: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', gap: 10 }}>
          <input value={r.label} onChange={e => setRow(rows, set, i, 'label', e.target.value)} style={{ ...rowInput, flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', width: 170, ...rowInput, fontFamily: "'IBM Plex Mono'" }}>
            <span style={{ color: '#9aa1ad', marginRight: 6 }}>₹</span>
            <input type="number" value={r.amt} onChange={e => setRow(rows, set, i, 'amt', e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontFamily: "'IBM Plex Mono'", fontSize: 13 }} />
            {suffix && <span style={{ color: '#9aa1ad', marginLeft: 'auto' }}>{suffix}</span>}
          </div>
          {rows.length > 1 && (
            <button onClick={() => set(rows.filter((_, j) => j !== i))} style={{ border: '1px solid #dcdfe6', background: '#fff', borderRadius: 9, width: 40, cursor: 'pointer', color: '#c5362c' }}>
              <Icon name="close" size={16} />
            </button>
          )}
        </div>
      ))}
      <button onClick={() => set([...rows, { label: '', amt: '0' }])} style={{ alignSelf: 'flex-start', border: '1px dashed #c5cad3', background: '#fff', color: '#687184', fontSize: 12.5, fontWeight: 600, padding: '8px 12px', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
        <Icon name="add" size={17} />{addLabel}
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <button onClick={goContracts} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#687184', fontWeight: 500, cursor: 'pointer', marginBottom: 16, background: 'none', border: 'none' }}>
        <Icon name="arrow_back" size={18} />Cancel
      </button>

      <div style={{ background: '#fff', border: '1px solid #e7e9ee', borderRadius: 16, boxShadow: '0 1px 2px rgba(16,24,40,.03)', padding: '26px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Client</label>
            <select value={clientId} onChange={e => setClientId(e.target.value)} style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 13.5, background: '#fff' }}>
              {state.clients.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Contract name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mobile App Build" style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 13.5, boxSizing: 'border-box' }} />
          </div>
        </div>

        <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 9 }}>Billing type</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
          {TYPE_CARDS.map(c => {
            const active = nt === c.key;
            return (
              <div key={c.key} onClick={() => setNewType(c.key as ContractType)}
                style={{ border: `1.5px solid ${active ? '#1f6feb' : '#e7e9ee'}`, background: active ? '#f5f9ff' : '#fff', borderRadius: 12, padding: '14px 12px', cursor: 'pointer', textAlign: 'center' }}>
                <Icon name={c.icon} size={24} color={active ? '#1f6feb' : '#9aa1ad'} />
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 7 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: '#9aa1ad', marginTop: 3, lineHeight: 1.35 }}>{c.desc}</div>
              </div>
            );
          })}
        </div>

        <div style={{ background: '#f7f9fc', border: '1px solid #eef0f3', borderRadius: 13, padding: '18px 20px', marginBottom: 24 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 14 }}>Rate configuration</div>
          {nt === 'HOURLY' && <RowEditor rows={roleRows} set={setRoleRows} addLabel="Add role" suffix="/ hr" />}
          {nt === 'MILESTONE' && <RowEditor rows={msRows} set={setMsRows} addLabel="Add milestone" />}
          {nt === 'METERED' && <RowEditor rows={unitRows} set={setUnitRows} addLabel="Add unit" />}
          {nt === 'SUBSCRIPTION' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11.5, color: '#687184', marginBottom: 6 }}>Amount (₹)</label>
                <input type="number" value={subAmt} onChange={e => setSubAmt(e.target.value)} style={{ ...rowInput, width: '100%', fontFamily: "'IBM Plex Mono'" }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11.5, color: '#687184', marginBottom: 6 }}>Interval</label>
                <div style={{ ...rowInput, display: 'flex', alignItems: 'center' }}>Monthly</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11.5, color: '#687184', marginBottom: 6 }}>Billing day</label>
                <input type="number" value={subDay} onChange={e => setSubDay(e.target.value)} style={{ ...rowInput, width: '100%', fontFamily: "'IBM Plex Mono'" }} />
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Approval mode</label>
            <div style={{ display: 'flex', background: '#f1f3f6', borderRadius: 9, padding: 3 }}>
              {(['MANUAL', 'AUTO'] as const).map(m => (
                <div key={m} onClick={() => setApproval(m)} style={{ flex: 1, textAlign: 'center', padding: '8px 0', fontSize: 12.5, fontWeight: approval === m ? 600 : 500, background: approval === m ? '#fff' : 'transparent', color: approval === m ? '#161b26' : '#687184', borderRadius: 7, boxShadow: approval === m ? '0 1px 2px rgba(16,24,40,.1)' : 'none', cursor: 'pointer' }}>
                  {m === 'MANUAL' ? 'Manual' : 'Auto-approve'}
                </div>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Start date</label>
            <input type="date" value={start} onChange={e => setStart(e.target.value)} style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 13.5, boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={goContracts} style={{ height: 43, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 10, padding: '0 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={save} disabled={!valid || busy} style={{ height: 43, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 10, padding: '0 22px', fontSize: 14, fontWeight: 600, cursor: valid && !busy ? 'pointer' : 'default', opacity: valid && !busy ? 1 : 0.6, boxShadow: '0 4px 12px rgba(31,111,235,.25)' }}>Create contract</button>
        </div>
      </div>
    </div>
  );
}
