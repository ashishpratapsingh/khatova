import { Card, Icon, Badge, Avatar } from '../ui';
import { money, walletStatus } from '../data';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  goClients: () => void;
  goApprovals: () => void;
  openClient: (id: string) => void;
  openTopup: (id: string) => void;
}

export default function AdminDashboard({ state, goClients, goApprovals, openClient, openTopup }: Props) {
  const CLIENTS = state.clients;
  const pending = state.events.filter(e => e.status === 'PENDING');
  const pendingAmt = pending.reduce((a, e) => a + e.amount, 0);
  const billedThisMonth = state.events.filter(e => e.status === 'BILLED').reduce((a, e) => a + e.amount, 0);
  const totalHeld = CLIENTS.reduce((a, c) => a + (state.balances[c.id] || 0), 0);
  const clientRows = CLIENTS.map(c => {
    const b = state.balances[c.id];
    const st = walletStatus(b, c.threshold);
    return { ...c, balance: b, balanceFmt: money(b, false), balanceColor: b < 0 ? '#b5362b' : '#161b26', st };
  });
  const attention = clientRows.filter(r => r.st.key !== 'HEALTHY');
  const approvalPreview = pending.slice(0, 4);

  const kpis = [
    { label: 'Total balance held', value: money(totalHeld, false), sub: `${CLIENTS.length} active wallets`, icon: 'account_balance_wallet', bg: '#eaf1fe', fg: '#1f6feb' },
    { label: 'Pending approvals', value: String(pending.length), sub: `${money(pendingAmt, false)} to bill`, icon: 'fact_check', bg: '#fbf0d9', fg: '#8a5d08' },
    { label: 'Needs attention', value: String(attention.length), sub: 'low or negative wallets', icon: 'warning', bg: '#fbe9e7', fg: '#b5362b' },
    { label: 'Billed this month', value: money(billedThisMonth, false), sub: 'usage across all clients', icon: 'trending_up', bg: '#e3f3ec', fg: '#0c6b4a' },
  ];

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 22 }}>
        {kpis.map(k => (
          <Card key={k.label} style={{ padding: '18px 18px 16px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={k.icon} size={21} color={k.fg} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.6px', fontFamily: "'IBM Plex Mono'", marginTop: 14 }}>{k.value}</div>
            <div style={{ fontSize: 13, color: '#3f4654', fontWeight: 500, marginTop: 3 }}>{k.label}</div>
            <div style={{ fontSize: 12, color: '#9aa1ad', marginTop: 2 }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Client wallets table */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid #eef0f3' }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Client wallets</div>
            <button onClick={goClients} style={{ fontSize: 13, color: '#1f6feb', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.1fr 1fr 96px', padding: '10px 18px', borderBottom: '1px solid #eef0f3', fontSize: 11.5, fontWeight: 600, color: '#9aa1ad', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
            <div>Client</div><div style={{ textAlign: 'right' }}>Balance</div><div style={{ textAlign: 'center' }}>Status</div><div />
          </div>
          {clientRows.map(c => (
            <div
              key={c.id}
              onClick={() => openClient(c.id)}
              style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.1fr 1fr 96px', alignItems: 'center', padding: '13px 18px', borderBottom: '1px solid #f2f3f6', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fafbfc')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                <Avatar text={c.initials} size={34} radius={9} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.company}</div>
                  <div style={{ fontSize: 12, color: '#9aa1ad' }}>{c.contact}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontFamily: "'IBM Plex Mono'", fontSize: 14, fontWeight: 600, color: c.balanceColor }}>{c.balanceFmt}</div>
              <div style={{ textAlign: 'center' }}><Badge label={c.st.label} bg={c.st.bg} fg={c.st.fg} /></div>
              <div style={{ textAlign: 'right' }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'start' }}>
          {/* Pending approvals */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 16px', borderBottom: '1px solid #eef0f3' }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>Pending approvals</div>
              <button onClick={goApprovals} style={{ fontSize: 12.5, color: '#1f6feb', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>Queue →</button>
            </div>
            {approvalPreview.length === 0 ? (
              <div style={{ padding: '22px 16px', textAlign: 'center', fontSize: 13, color: '#9aa1ad' }}>All caught up — nothing to approve.</div>
            ) : (
              approvalPreview.map(ev => (
                <div
                  key={ev.id}
                  onClick={goApprovals}
                  style={{ padding: '12px 16px', borderBottom: '1px solid #f2f3f6', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafbfc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.client}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{money(ev.amount, false)}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#687184', marginTop: 3 }}>{ev.staff} · {ev.qty}{ev.type === 'HOURLY' ? ' hrs' : ' unit'} · {ev.unit}</div>
                </div>
              ))
            )}
          </Card>

          {/* Needs attention */}
          <Card>
            <div style={{ padding: '15px 16px', borderBottom: '1px solid #eef0f3', fontSize: 14.5, fontWeight: 600 }}>Needs attention</div>
            {attention.map(c => (
              <div
                key={c.id}
                onClick={() => openClient(c.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 16px', borderBottom: '1px solid #f2f3f6', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fafbfc')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Icon name={c.st.key === 'NEGATIVE' ? 'error' : 'warning'} size={20} color={c.st.fg} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.company}</div>
                  <div style={{ fontSize: 12, color: '#687184' }}>{c.st.key === 'NEGATIVE' ? 'Negative balance · ALLOW policy' : 'Below low-balance threshold'}</div>
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 13, fontWeight: 600, color: c.balanceColor }}>{c.balanceFmt}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
