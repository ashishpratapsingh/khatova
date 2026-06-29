import { useState } from 'react';
import { money, getUnitOptions } from '../data';
import type { AppState, ContractType } from '../types';

interface Props {
  state: AppState;
  setContract: (id: string) => void;
  setUnit: (k: string) => void;
  setQty: (q: string) => void;
  submit: (p: { contractId: string; unit: string; qty: number; amount: number; type: ContractType; desc: string }) => Promise<void>;
}

export default function StaffLog({ state, setContract, setUnit, setQty, submit }: Props) {
  const myContracts = state.contracts;
  const contractId = state.logContract || myContracts[0]?.id || '';
  const contract = myContracts.find(c => c.id === contractId);
  const unitOpts = getUnitOptions(state.ratesByContract[contractId]);
  const lu = unitOpts.find(u => u.key === state.logUnit) || unitOpts[0];
  const qtyNum = parseFloat(state.logQty || '0') || 0;
  const logAmt = lu ? (lu.isMilestone ? lu.amount : Math.round(qtyNum * (lu.rate || 0))) : 0;
  const isMilestone = lu?.isMilestone ?? false;
  const [desc, setDesc] = useState('');
  const [busy, setBusy] = useState(false);

  const canSubmit = !!contract && !!lu && (isMilestone || qtyNum > 0) && desc.trim().length > 0;

  const doSubmit = async () => {
    if (!canSubmit || busy || !contract || !lu) return;
    setBusy(true);
    try {
      await submit({ contractId, unit: lu.label, qty: isMilestone ? 1 : qtyNum, amount: logAmt, type: contract.type, desc });
      setDesc('');
    } finally { setBusy(false); }
  };

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <div style={{ background: '#fff', border: '1px solid #e7e9ee', borderRadius: 16, boxShadow: '0 1px 2px rgba(16,24,40,.03)', padding: '26px 28px' }}>
        <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 2 }}>Log a usage event</div>
        <p style={{ fontSize: 13, color: '#687184', margin: '0 0 22px' }}>Record billable work against an assigned contract. Manual contracts go to admin for approval.</p>

        {myContracts.length === 0 && (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#9aa1ad', fontSize: 13.5 }}>You have no assigned contracts yet.</div>
        )}

        {myContracts.length > 0 && <>
        <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Contract</label>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <select
            value={contractId}
            onChange={e => { setContract(e.target.value); setUnit(''); }}
            style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 36px 0 13px', fontSize: 13.5, background: '#fff', color: '#161b26', appearance: 'none', cursor: 'pointer' }}
          >
            {myContracts.map(c => <option key={c.id} value={c.id}>{c.name} — {c.client}</option>)}
          </select>
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: 20, color: '#9aa1ad', position: 'absolute', right: 11, top: 12, pointerEvents: 'none' }}>expand_more</span>
        </div>

        <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Role / unit</label>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <select
            value={lu?.key ?? ''}
            onChange={e => setUnit(e.target.value)}
            style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 36px 0 13px', fontSize: 13.5, background: '#fff', color: '#161b26', appearance: 'none', cursor: 'pointer' }}
          >
            {unitOpts.map(u => (
              <option key={u.key} value={u.key}>
                {u.isMilestone ? `${u.label} — ${money(u.amount, false)}` : `${u.label} — ${money(u.rate, false)}`}
              </option>
            ))}
          </select>
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: 20, color: '#9aa1ad', position: 'absolute', right: 11, top: 12, pointerEvents: 'none' }}>expand_more</span>
        </div>

        {!isMilestone && (
          <>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Quantity (hours / units)</label>
            <input
              type="number"
              value={state.logQty}
              onChange={e => setQty(e.target.value)}
              style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 15, fontWeight: 600, fontFamily: "'IBM Plex Mono'", marginBottom: 16, boxSizing: 'border-box' }}
            />
          </>
        )}

        <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Description</label>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="What did you work on?"
          style={{ width: '100%', height: 78, border: '1px solid #dcdfe6', borderRadius: 10, padding: '11px 13px', fontSize: 13.5, resize: 'none', marginBottom: 18, fontFamily: "'IBM Plex Sans'", boxSizing: 'border-box' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f5f9ff', border: '1px solid #d8e6fd', borderRadius: 12, padding: '15px 18px', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12.5, color: '#3f4654', fontWeight: 500 }}>Estimated charge</div>
            <div style={{ fontSize: 11.5, color: '#9aa1ad', marginTop: 2 }}>{contract?.approval === 'AUTO' ? 'Auto-billed on submit' : 'at current contract rate'}</div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "'IBM Plex Mono'", color: '#1f6feb', letterSpacing: '-0.5px' }}>{money(logAmt, false)}</div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { setQty('0'); setDesc(''); }} style={{ flex: 1, height: 44, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Reset</button>
          <button onClick={doSubmit} disabled={!canSubmit || busy} style={{ flex: 2, height: 44, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: canSubmit && !busy ? 'pointer' : 'default', opacity: canSubmit && !busy ? 1 : 0.6, boxShadow: '0 4px 12px rgba(31,111,235,.25)' }}>
            {contract?.approval === 'AUTO' ? 'Submit & bill' : 'Submit for approval'}
          </button>
        </div>
        </>}
      </div>
    </div>
  );
}
