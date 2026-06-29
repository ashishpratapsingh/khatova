import { Card, Badge, TypeBadge } from '../ui';
import { money, typeChip, evStatusChip, qtyLabel } from '../data';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  myId: string;
}

export default function StaffHistory({ state }: Props) {
  const myEvents = state.events;
  const cName = (id: string) => state.contracts.find(c => c.id === id)?.name || id;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr 1fr', padding: '11px 20px', borderBottom: '1px solid #eef0f3', fontSize: 11.5, fontWeight: 600, color: '#9aa1ad', letterSpacing: '0.03em', textTransform: 'uppercase' as const }}>
          <div>Work</div><div>Contract</div><div>Logged</div><div>Status</div><div style={{ textAlign: 'right' }}>Amount</div>
        </div>
        {myEvents.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: 13.5, color: '#9aa1ad' }}>No usage events logged yet.</div>
        )}
        {myEvents.map(ev => {
          const tc = typeChip(ev.type);
          const sc = evStatusChip(ev.status);
          const ql = qtyLabel(ev);
          return (
            <div key={ev.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr 1fr', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #f2f3f6' }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: '#161b26' }}>{ev.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}>
                  <TypeBadge label={tc.label} bg={tc.bg} fg={tc.fg} />
                  <span style={{ fontSize: 12, color: '#9aa1ad' }}>{ql} · {ev.unit}</span>
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#3f4654' }}>{cName(ev.contractId)}</div>
              <div style={{ fontSize: 12.5, color: '#687184' }}>{ev.date}</div>
              <div><Badge label={sc.label} bg={sc.bg} fg={sc.fg} /></div>
              <div style={{ textAlign: 'right', fontFamily: "'IBM Plex Mono'", fontSize: 13.5, fontWeight: 600 }}>{money(ev.amount, false)}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
