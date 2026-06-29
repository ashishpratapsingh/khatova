import { Icon } from '../ui';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  setNewType: (t: AppState['newType']) => void;
  goContracts: () => void;
  saveContract: () => void;
}

const TYPE_CARDS = [
  { key: 'HOURLY', label: 'Hourly', icon: 'schedule', desc: 'Bill by the hour per role' },
  { key: 'MILESTONE', label: 'Milestone', icon: 'flag', desc: 'Fixed amounts per deliverable' },
  { key: 'SUBSCRIPTION', label: 'Subscription', icon: 'autorenew', desc: 'Recurring fixed charge' },
  { key: 'METERED', label: 'Metered', icon: 'speed', desc: 'Per-unit usage billing' },
] as const;

export default function AdminNewContract({ state, setNewType, goContracts, saveContract }: Props) {
  const nt = state.newType;

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <button onClick={goContracts} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#687184', fontWeight: 500, cursor: 'pointer', marginBottom: 16, background: 'none', border: 'none' }}>
        <Icon name="arrow_back" size={18} />Cancel
      </button>

      <div style={{ background: '#fff', border: '1px solid #e7e9ee', borderRadius: 16, boxShadow: '0 1px 2px rgba(16,24,40,.03)', padding: '26px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Client</label>
            <div style={{ height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13.5, cursor: 'pointer' }}>
              <span>Acme Retail</span><Icon name="expand_more" size={20} color="#9aa1ad" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Contract name</label>
            <input placeholder="e.g. Mobile App Build" style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 13.5 }} />
          </div>
        </div>

        <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 9 }}>Billing type</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
          {TYPE_CARDS.map(c => {
            const active = nt === c.key;
            return (
              <div
                key={c.key}
                onClick={() => setNewType(c.key as AppState['newType'])}
                style={{ border: `1.5px solid ${active ? '#1f6feb' : '#e7e9ee'}`, background: active ? '#f5f9ff' : '#fff', borderRadius: 12, padding: '14px 12px', cursor: 'pointer', textAlign: 'center' }}
              >
                <Icon name={c.icon} size={24} color={active ? '#1f6feb' : '#9aa1ad'} />
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 7 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: '#9aa1ad', marginTop: 3, lineHeight: 1.35 }}>{c.desc}</div>
              </div>
            );
          })}
        </div>

        <div style={{ background: '#f7f9fc', border: '1px solid #eef0f3', borderRadius: 13, padding: '18px 20px', marginBottom: 24 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 14 }}>Rate configuration</div>
          {nt === 'HOURLY' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Senior Developer', '2,500'], ['Designer', '1,500']].map(([role, rate]) => (
                <div key={role} style={{ display: 'flex', gap: 10 }}>
                  <input defaultValue={role} style={{ flex: 1, height: 40, border: '1px solid #dcdfe6', borderRadius: 9, padding: '0 12px', fontSize: 13, background: '#fff' }} />
                  <div style={{ display: 'flex', alignItems: 'center', width: 160, height: 40, border: '1px solid #dcdfe6', borderRadius: 9, padding: '0 12px', fontSize: 13, background: '#fff', fontFamily: "'IBM Plex Mono'" }}>
                    <span style={{ color: '#9aa1ad', marginRight: 6 }}>₹</span><span>{rate}</span><span style={{ color: '#9aa1ad', marginLeft: 'auto' }}>/ hr</span>
                  </div>
                </div>
              ))}
              <button style={{ alignSelf: 'flex-start', border: '1px dashed #c5cad3', background: '#fff', color: '#687184', fontSize: 12.5, fontWeight: 600, padding: '8px 12px', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name="add" size={17} />Add role
              </button>
            </div>
          )}
          {nt === 'MILESTONE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['UI/UX Design', '50,000'], ['Development', '1,20,000']].map(([ms, amt]) => (
                <div key={ms} style={{ display: 'flex', gap: 10 }}>
                  <input defaultValue={ms} style={{ flex: 1, height: 40, border: '1px solid #dcdfe6', borderRadius: 9, padding: '0 12px', fontSize: 13, background: '#fff' }} />
                  <div style={{ display: 'flex', alignItems: 'center', width: 160, height: 40, border: '1px solid #dcdfe6', borderRadius: 9, padding: '0 12px', fontSize: 13, background: '#fff', fontFamily: "'IBM Plex Mono'" }}>
                    <span style={{ color: '#9aa1ad', marginRight: 6 }}>₹</span><span>{amt}</span>
                  </div>
                </div>
              ))}
              <button style={{ alignSelf: 'flex-start', border: '1px dashed #c5cad3', background: '#fff', color: '#687184', fontSize: 12.5, fontWeight: 600, padding: '8px 12px', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name="add" size={17} />Add milestone
              </button>
            </div>
          )}
          {nt === 'SUBSCRIPTION' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[['Amount', '₹10,000'], ['Interval', 'Monthly'], ['Billing day', '1']].map(([l, v]) => (
                <div key={l}>
                  <label style={{ display: 'block', fontSize: 11.5, color: '#687184', marginBottom: 6 }}>{l}</label>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 40, border: '1px solid #dcdfe6', borderRadius: 9, padding: '0 12px', fontSize: 13, background: '#fff', fontFamily: l !== 'Interval' ? "'IBM Plex Mono'" : 'inherit' }}>
                    {v}{l === 'Interval' && <Icon name="expand_more" size={18} color="#9aa1ad" />}
                  </div>
                </div>
              ))}
            </div>
          )}
          {nt === 'METERED' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['API Calls (per 1k)', '100'], ['Storage (per GB)', '50']].map(([unit, rate]) => (
                <div key={unit} style={{ display: 'flex', gap: 10 }}>
                  <input defaultValue={unit} style={{ flex: 1, height: 40, border: '1px solid #dcdfe6', borderRadius: 9, padding: '0 12px', fontSize: 13, background: '#fff' }} />
                  <div style={{ display: 'flex', alignItems: 'center', width: 160, height: 40, border: '1px solid #dcdfe6', borderRadius: 9, padding: '0 12px', fontSize: 13, background: '#fff', fontFamily: "'IBM Plex Mono'" }}>
                    <span style={{ color: '#9aa1ad', marginRight: 6 }}>₹</span><span>{rate}</span>
                  </div>
                </div>
              ))}
              <button style={{ alignSelf: 'flex-start', border: '1px dashed #c5cad3', background: '#fff', color: '#687184', fontSize: 12.5, fontWeight: 600, padding: '8px 12px', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name="add" size={17} />Add unit
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Approval mode</label>
            <div style={{ display: 'flex', background: '#f1f3f6', borderRadius: 9, padding: 3 }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '8px 0', fontSize: 12.5, fontWeight: 600, background: '#fff', borderRadius: 7, boxShadow: '0 1px 2px rgba(16,24,40,.1)', cursor: 'pointer' }}>Manual</div>
              <div style={{ flex: 1, textAlign: 'center', padding: '8px 0', fontSize: 12.5, fontWeight: 500, color: '#687184', cursor: 'pointer' }}>Auto-approve</div>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Start date</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 13.5 }}>
              Jun 25, 2025<Icon name="calendar_today" size={19} color="#9aa1ad" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={goContracts} style={{ height: 43, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 10, padding: '0 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={saveContract} style={{ height: 43, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 10, padding: '0 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(31,111,235,.25)' }}>Create contract</button>
        </div>
      </div>
    </div>
  );
}
