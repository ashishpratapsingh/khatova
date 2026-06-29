import { money, CONTRACTS, getUnitOptions } from '../data';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  setContract: (id: string) => void;
  setUnit: (k: string) => void;
  setQty: (q: string) => void;
  submit: () => void;
  reset: () => void;
}

export default function StaffLog({ state, setContract, setUnit, setQty, submit, reset }: Props) {
  const myContracts = CONTRACTS.filter(c => ['k1', 'k3'].includes(c.id));
  const unitOpts = getUnitOptions(state.logContract);
  const lu = unitOpts.find(u => u.key === state.logUnit) || unitOpts[0];
  const qtyNum = parseFloat(state.logQty || '0') || 0;
  const logAmt = lu ? (lu.isMilestone ? lu.amount : Math.round(qtyNum * (lu.rate || 0))) : 0;
  const isMilestone = lu?.isMilestone ?? false;

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <div style={{ background: '#fff', border: '1px solid #e7e9ee', borderRadius: 16, boxShadow: '0 1px 2px rgba(16,24,40,.03)', padding: '26px 28px' }}>
        <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 2 }}>Log a usage event</div>
        <p style={{ fontSize: 13, color: '#687184', margin: '0 0 22px' }}>Record billable work against an assigned contract. Manual contracts go to admin for approval.</p>

        <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Contract</label>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <select
            value={state.logContract}
            onChange={e => setContract(e.target.value)}
            style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 36px 0 13px', fontSize: 13.5, background: '#fff', color: '#161b26', appearance: 'none', cursor: 'pointer' }}
          >
            {myContracts.map(c => <option key={c.id} value={c.id}>{c.name} — {c.client}</option>)}
          </select>
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: 20, color: '#9aa1ad', position: 'absolute', right: 11, top: 12, pointerEvents: 'none' }}>expand_more</span>
        </div>

        <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Role / unit</label>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <select
            value={state.logUnit}
            onChange={e => setUnit(e.target.value)}
            style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 36px 0 13px', fontSize: 13.5, background: '#fff', color: '#161b26', appearance: 'none', cursor: 'pointer' }}
          >
            {unitOpts.map(u => (
              <option key={u.key} value={u.key}>
                {u.isMilestone ? u.label : `${u.label} — ${money(u.rate, false)}/hr`}
              </option>
            ))}
          </select>
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: 20, color: '#9aa1ad', position: 'absolute', right: 11, top: 12, pointerEvents: 'none' }}>expand_more</span>
        </div>

        {!isMilestone && (
          <>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Quantity (hours / units)</label>
            <input
              value={state.logQty}
              onChange={e => setQty(e.target.value)}
              style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 15, fontWeight: 600, fontFamily: "'IBM Plex Mono'", marginBottom: 16 }}
              onFocus={e => { e.currentTarget.style.borderColor = '#1f6feb'; e.currentTarget.style.boxShadow = '0 0 0 3px #eaf1fe'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#dcdfe6'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </>
        )}

        <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Description</label>
        <textarea
          placeholder="What did you work on?"
          style={{ width: '100%', height: 78, border: '1px solid #dcdfe6', borderRadius: 10, padding: '11px 13px', fontSize: 13.5, resize: 'none', marginBottom: 18, fontFamily: "'IBM Plex Sans'" }}
          onFocus={e => { e.currentTarget.style.borderColor = '#1f6feb'; e.currentTarget.style.boxShadow = '0 0 0 3px #eaf1fe'; }}
          onBlur={e => { e.currentTarget.style.borderColor = '#dcdfe6'; e.currentTarget.style.boxShadow = 'none'; }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f5f9ff', border: '1px solid #d8e6fd', borderRadius: 12, padding: '15px 18px', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12.5, color: '#3f4654', fontWeight: 500 }}>Estimated charge</div>
            <div style={{ fontSize: 11.5, color: '#9aa1ad', marginTop: 2 }}>at current contract rate</div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "'IBM Plex Mono'", color: '#1f6feb', letterSpacing: '-0.5px' }}>{money(logAmt, false)}</div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={reset} style={{ flex: 1, height: 44, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Reset</button>
          <button onClick={submit} style={{ flex: 2, height: 44, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(31,111,235,.25)' }}>Submit for approval</button>
        </div>
      </div>
    </div>
  );
}
