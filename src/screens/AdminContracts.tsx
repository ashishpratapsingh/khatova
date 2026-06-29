import { Card, Badge, TypeBadge, Icon } from '../ui';
import { typeChip } from '../data';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  openContract: (id: string) => void;
  goNewContract: () => void;
}

export default function AdminContracts({ state, openContract, goNewContract }: Props) {
  const stMap: Record<string, { label: string; bg: string; fg: string }> = {
    ACTIVE: { label: 'Active', bg: '#e3f3ec', fg: '#0c6b4a' },
    PAUSED: { label: 'Paused', bg: '#fbf0d9', fg: '#8a5d08' },
    ENDED: { label: 'Ended', bg: '#eef0f3', fg: '#7a8190' },
  };

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <div className="k-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div className="k-scroll" style={{ display: 'flex', gap: 6, background: '#fff', border: '1px solid #e7e9ee', borderRadius: 10, padding: 4, maxWidth: '100%' }}>
          {['All types', 'Hourly', 'Milestone', 'Subscription', 'Metered'].map((f, i) => (
            <span key={f} style={{ fontSize: 12.5, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? '#1f6feb' : '#687184', background: i === 0 ? '#eaf1fe' : 'transparent', padding: '6px 12px', borderRadius: 7, cursor: 'pointer' }}>{f}</span>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={goNewContract}
          style={{ height: 38, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 9, padding: '0 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(31,111,235,.22)' }}
        >
          <Icon name="add" size={19} color="#fff" />New contract
        </button>
      </div>

      <Card className="k-scroll">
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.3fr 1.2fr 1.2fr 1fr 40px', padding: '11px 20px', borderBottom: '1px solid #eef0f3', fontSize: 11.5, fontWeight: 600, color: '#9aa1ad', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
          <div>Contract</div><div>Client</div><div>Rate</div><div>Type</div><div style={{ textAlign: 'center' }}>Status</div><div />
        </div>
        {state.contracts.map(c => {
          const tc = typeChip(c.type);
          const st = stMap[c.status];
          return (
            <div
              key={c.id}
              onClick={() => openContract(c.id)}
              style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.3fr 1.2fr 1.2fr 1fr 40px', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #f2f3f6', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fafbfc')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                <div style={{ fontSize: 12, color: '#9aa1ad' }}>{c.approval === 'AUTO' ? 'Auto-approve' : 'Manual'} · {c.staffCount} staff</div>
              </div>
              <div style={{ fontSize: 13, color: '#3f4654', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.client}</div>
              <div style={{ fontSize: 13, color: '#3f4654', fontFamily: "'IBM Plex Mono'" }}>{c.rateSummary}</div>
              <div><TypeBadge label={tc.label} bg={tc.bg} fg={tc.fg} /></div>
              <div style={{ textAlign: 'center' }}><Badge label={st.label} bg={st.bg} fg={st.fg} /></div>
              <div style={{ textAlign: 'right' }}><Icon name="chevron_right" size={20} color="#c5cad3" /></div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
