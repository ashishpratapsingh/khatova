import { Card, TypeBadge, Icon } from '../ui';
import { typeChip } from '../data';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  goLog: () => void;
  goLogForContract: (id: string) => void;
}

export default function StaffDashboard({ state, goLog, goLogForContract }: Props) {
  const myContracts = state.contracts;
  const hours = state.events.filter(e => e.type === 'HOURLY').reduce((a, e) => a + e.qty, 0);
  const hoursByContract = (id: string) => state.events.filter(e => e.contractId === id && e.type === 'HOURLY').reduce((a, e) => a + e.qty, 0);
  const stats = [
    { label: 'Hours logged', value: `${hours} h`, color: '#161b26' },
    { label: 'Pending approval', value: String(state.events.filter(e => e.status === 'PENDING').length), color: '#8a5d08' },
    { label: 'Billed', value: String(state.events.filter(e => e.status === 'BILLED').length), color: '#0c6b4a' },
  ];

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,#0e1726,#15243c)', borderRadius: 16, padding: '24px 26px', marginBottom: 20, color: '#fff' }}>
        <div>
          <div style={{ fontSize: 13, color: '#9fb0cc', fontWeight: 500 }}>Welcome back</div>
          <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: '-0.4px', marginTop: 5 }}>You have {myContracts.length} assigned contract{myContracts.length === 1 ? '' : 's'}</div>
        </div>
        <button
          onClick={goLog}
          style={{ height: 42, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 10, padding: '0 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(31,111,235,.4)' }}
        >
          <Icon name="edit_note" size={20} color="#fff" />Log usage
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 22 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ padding: 18 }}>
            <div style={{ fontSize: 12.5, color: '#687184', fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 600, fontFamily: "'IBM Plex Mono'", marginTop: 8, color: s.color }}>{s.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#3f4654' }}>Your assigned contracts</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {myContracts.map(c => {
          const tc = typeChip(c.type);
          const loggedHours = `${hoursByContract(c.id)} h`;
          return (
            <div key={c.id} style={{ background: '#fff', border: '1px solid #e7e9ee', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{c.name}</span>
                  <TypeBadge label={tc.label} bg={tc.bg} fg={tc.fg} />
                </div>
                <div style={{ fontSize: 12.5, color: '#687184', marginTop: 5 }}>{c.client} · {c.rateSummary}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11.5, color: '#9aa1ad' }}>Logged this month</div>
                <div style={{ fontSize: 15, fontWeight: 600, fontFamily: "'IBM Plex Mono'", marginTop: 2 }}>{loggedHours}</div>
              </div>
              <button
                onClick={() => goLogForContract(c.id)}
                style={{ height: 38, border: '1px solid #dcdfe6', background: '#fff', color: '#1f6feb', borderRadius: 9, padding: '0 15px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Log usage
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
