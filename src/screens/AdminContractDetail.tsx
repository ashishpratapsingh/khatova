import { Card, TypeBadge, Icon } from '../ui';
import { money, typeChip } from '../data';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  back: () => void;
}

export default function AdminContractDetail({ state, back }: Props) {
  const contract = state.contracts.find(c => c.id === state.selContract) || state.contracts[0];
  if (!contract) return null;
  const rate = state.ratesByContract[contract.id] || { kind: 'roles' as const, rows: [] };
  const tc = typeChip(contract.type);
  const events = state.events.filter(e => e.contractId === contract.id);

  const evChip = (s: string) => ({ PENDING: { label: 'Pending', bg: '#fbf0d9', fg: '#8a5d08' }, BILLED: { label: 'Billed', bg: '#e3f3ec', fg: '#0c6b4a' }, REJECTED: { label: 'Rejected', bg: '#eef0f3', fg: '#7a8190' } }[s] || { label: s, bg: '#eef0f3', fg: '#7a8190' });

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <button onClick={back} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#687184', fontWeight: 500, cursor: 'pointer', marginBottom: 16, background: 'none', border: 'none' }}>
        <Icon name="arrow_back" size={18} />All contracts
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', margin: 0 }}>{contract.name}</h2>
            <TypeBadge label={tc.label} bg={tc.bg} fg={tc.fg} />
          </div>
          <div style={{ fontSize: 13, color: '#687184', marginTop: 5 }}>{contract.client} · {contract.approval === 'AUTO' ? 'Auto-approve' : 'Manual approval'} · {contract.start} → {contract.end}</div>
        </div>
      </div>

      <div className="rg-2" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18, alignItems: 'start' }}>
        <Card>
          <div style={{ padding: '15px 20px', borderBottom: '1px solid #eef0f3', fontSize: 15, fontWeight: 600 }}>Rate configuration</div>
          {rate.kind === 'sub' && (
            <div style={{ padding: '22px 20px', display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 30, fontWeight: 600, fontFamily: "'IBM Plex Mono'", letterSpacing: '-0.8px' }}>{money(rate.amount!, false)}</span>
              <span style={{ fontSize: 14, color: '#687184' }}>/ {rate.interval} · auto-deducts on day {rate.day}</span>
            </div>
          )}
          {rate.kind === 'milestones' && (
            <div style={{ padding: '14px 20px 6px', fontSize: 12.5, color: '#687184' }}>
              {(rate.rows || []).filter(r => r.done).length} of {(rate.rows || []).length} milestones billed
            </div>
          )}
          {(rate.rows || []).map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', borderTop: '1px solid #f2f3f6' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.label}</div>
                <div style={{ fontSize: 12, color: '#9aa1ad' }}>{r.sub || (r.done != null ? (r.done ? 'Completed' : 'Pending') : '')}</div>
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 14, fontWeight: 600 }}>{money(r.amount, false)}</div>
            </div>
          ))}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 14 }}>Assigned staff</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[['PS', 'Priya Sharma'], ['RM', 'Rohan Mehta']].map(([init, name]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#efecfb', color: '#6b4ee0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{init}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding: '18px 20px' }}>
            {[
              ['Approval mode', contract.approval === 'AUTO' ? 'Auto-approve' : 'Manual approval'],
              ['Start date', contract.start],
              ['End date', contract.end],
              ['Status', contract.status],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#687184' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <Card style={{ marginTop: 18 }}>
        <div style={{ padding: '15px 20px', borderBottom: '1px solid #eef0f3', fontSize: 15, fontWeight: 600 }}>Usage events</div>
        {events.map(e => {
          const chip = evChip(e.status);
          const init = e.staff.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
          const qty = e.type === 'HOURLY' ? `${e.qty} hrs` : e.type === 'MILESTONE' ? '1 milestone' : `${e.qty} units`;
          return (
            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', alignItems: 'center', gap: 14, padding: '13px 20px', borderBottom: '1px solid #f2f3f6' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eef1f6', color: '#54607a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{init}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.desc}</div>
                <div style={{ fontSize: 12, color: '#9aa1ad' }}>{e.staff} · {qty} · {e.date}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: chip.bg, color: chip.fg }}>{chip.label}</span>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 13.5, fontWeight: 600, width: 90, textAlign: 'right' }}>{money(e.amount, false)}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
