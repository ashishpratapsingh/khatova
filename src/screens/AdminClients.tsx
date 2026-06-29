import { Card, Badge, Avatar, Icon } from '../ui';
import { money, walletStatus } from '../data';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  openClient: (id: string) => void;
  openTopup: (id: string) => void;
  openAddUser: () => void;
}

export default function AdminClients({ state, openClient, openTopup, openAddUser }: Props) {
  const rows = state.clients.map(c => {
    const b = state.balances[c.id];
    const st = walletStatus(b, c.threshold);
    return { ...c, balance: b, balanceFmt: money(b, false), balanceColor: b < 0 ? '#b5362b' : '#161b26', st };
  });

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <div className="k-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 6, background: '#fff', border: '1px solid #e7e9ee', borderRadius: 10, padding: 4 }}>
          {['All', 'Healthy', 'Low', 'Negative'].map((f, i) => (
            <span key={f} style={{ fontSize: 12.5, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? '#1f6feb' : '#687184', background: i === 0 ? '#eaf1fe' : 'transparent', padding: '6px 12px', borderRadius: 7, cursor: 'pointer' }}>{f}</span>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, background: '#fff', border: '1px solid #e7e9ee', borderRadius: 9, padding: '0 12px', width: 220 }}>
          <Icon name="search" size={19} color="#9aa1ad" />
          <span style={{ fontSize: 13, color: '#9aa1ad' }}>Search clients…</span>
        </div>
        <button
          onClick={openAddUser}
          style={{ height: 38, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 9, padding: '0 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(31,111,235,.22)' }}
        >
          <Icon name="add" size={19} color="#fff" />New client
        </button>
      </div>

      <Card className="k-scroll">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.1fr 1fr 116px', padding: '11px 20px', borderBottom: '1px solid #eef0f3', fontSize: 11.5, fontWeight: 600, color: '#9aa1ad', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
          <div>Client</div><div>Billing email</div><div style={{ textAlign: 'right' }}>Balance</div><div style={{ textAlign: 'center' }}>Status</div><div />
        </div>
        {rows.map(c => (
          <div
            key={c.id}
            onClick={() => openClient(c.id)}
            style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.1fr 1fr 116px', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #f2f3f6', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fafbfc')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <Avatar text={c.initials} size={36} radius={9} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.company}</div>
                <div style={{ fontSize: 12, color: '#9aa1ad' }}>{c.contact}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#687184', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.email}</div>
            <div style={{ textAlign: 'right', fontFamily: "'IBM Plex Mono'", fontSize: 14, fontWeight: 600, color: c.balanceColor }}>{c.balanceFmt}</div>
            <div style={{ textAlign: 'center' }}><Badge label={c.st.label} bg={c.st.bg} fg={c.st.fg} /></div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={ev => { ev.stopPropagation(); openTopup(c.id); }}
                style={{ border: '1px solid #dcdfe6', background: '#fff', color: '#1f6feb', fontSize: 12, fontWeight: 600, padding: '6px 11px', borderRadius: 8, cursor: 'pointer' }}
              >
                Top up
              </button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
