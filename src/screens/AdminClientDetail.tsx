import { Card, Badge, Avatar, Icon, TypeBadge } from '../ui';
import { money, walletStatus } from '../data';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  back: () => void;
  openTopup: (id: string) => void;
  openAdjust: (id: string) => void;
  openContract: (id: string) => void;
  setTab: (t: AppState['clientTab']) => void;
  openEdit: (id: string) => void;
}

export default function AdminClientDetail({ state, back, openTopup, openAdjust, openContract, setTab, openEdit }: Props) {
  const client = state.clients.find(c => c.id === state.selClient) || state.clients[0];
  if (!client) return null;
  const bal = state.balances[state.selClient] ?? client.balance;
  const st = walletStatus(bal, client.threshold);
  const led = state.ledgers[state.selClient] || [];
  const contracts = state.contracts.filter(c => c.clientId === state.selClient);
  const tab = state.clientTab;

  const tabs = (['overview', 'ledger', 'contracts', 'settings'] as const).map(k => ({
    key: k, label: k.charAt(0).toUpperCase() + k.slice(1),
    active: tab === k,
  }));

  const policyOpts: Array<{ k: string; title: string; desc: string; icon: string }> = [
    { k: 'BLOCK', title: 'Block', desc: 'Reject any charge that would overdraw the wallet', icon: 'block' },
    { k: 'ALLOW', title: 'Allow', desc: 'Permit the balance to go negative', icon: 'check_circle' },
    { k: 'PAUSE', title: 'Pause', desc: 'Auto-pause contracts when funds run low', icon: 'pause_circle' },
  ];

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <button onClick={back} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#687184', fontWeight: 500, cursor: 'pointer', marginBottom: 16, background: 'none', border: 'none' }}>
        <Icon name="arrow_back" size={18} />All clients
      </button>

      <div className="k-wrap" style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 22 }}>
        <Avatar text={client.initials} size={56} radius={13} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', margin: 0 }}>{client.company}</h2>
            <Badge label={st.label} bg={st.bg} fg={st.fg} />
          </div>
          <div style={{ fontSize: 13, color: '#687184', marginTop: 4 }}>{client.contact} · {client.email}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => openEdit(state.selClient)} style={{ height: 40, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 9, padding: '0 14px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="edit" size={17} color="#687184" />Edit
          </button>
          <button onClick={() => openAdjust(state.selClient)} style={{ height: 40, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 9, padding: '0 14px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>Adjust</button>
          <button onClick={() => openTopup(state.selClient)} style={{ height: 40, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 9, padding: '0 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="add" size={19} color="#fff" />Top up
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 26, borderBottom: '1px solid #e7e9ee', marginBottom: 22 }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{ padding: '0 1px 13px', fontSize: 14, fontWeight: t.active ? 600 : 500, color: t.active ? '#161b26' : '#687184', borderBottom: `2px solid ${t.active ? '#161b26' : 'transparent'}`, cursor: 'pointer', marginBottom: -1, background: 'none', border: 'none', borderBottomWidth: 2, borderBottomStyle: 'solid', borderBottomColor: t.active ? '#161b26' : 'transparent' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <>
          <div className="rg-4" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr 1fr', gap: 16, marginBottom: 22 }}>
            <Card style={{ padding: 18 }}>
              <div style={{ fontSize: 12.5, color: '#687184', fontWeight: 500 }}>Current balance</div>
              <div style={{ fontSize: 26, fontWeight: 600, fontFamily: "'IBM Plex Mono'", letterSpacing: '-0.6px', marginTop: 8, color: bal < 0 ? '#b5362b' : '#161b26' }}>{money(bal, false)}</div>
            </Card>
            <Card style={{ padding: 18 }}>
              <div style={{ fontSize: 12.5, color: '#687184', fontWeight: 500 }}>Low-balance alert</div>
              <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "'IBM Plex Mono'", marginTop: 10 }}>{money(client.threshold, false)}</div>
              <div style={{ fontSize: 12, color: '#9aa1ad', marginTop: 3 }}>notify at or below</div>
            </Card>
            <Card style={{ padding: 18 }}>
              <div style={{ fontSize: 12.5, color: '#687184', fontWeight: 500 }}>Negative policy</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 11 }}>{client.policy}</div>
              <div style={{ fontSize: 12, color: '#9aa1ad', marginTop: 3 }}>on insufficient funds</div>
            </Card>
            <Card style={{ padding: 18 }}>
              <div style={{ fontSize: 12.5, color: '#687184', fontWeight: 500 }}>Wallet currency</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 11 }}>INR · ₹</div>
              <div style={{ fontSize: 12, color: '#9aa1ad', marginTop: 3 }}>ISO 4217</div>
            </Card>
          </div>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '1px solid #eef0f3' }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Recent activity</div>
            </div>
            {led.slice(0, 6).map((e, i) => {
              const cr = e.type !== 'DEBIT' && !e.neg;
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', alignItems: 'center', gap: 14, padding: '13px 20px', borderBottom: '1px solid #f2f3f6' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cr ? '#0c7a52' : '#c5362c' }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.desc}</div>
                    <div style={{ fontSize: 12, color: '#9aa1ad' }}>{e.date} · {e.type === 'ADJUSTMENT' ? 'Adjustment' : cr ? 'Credit' : 'Debit'}</div>
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 13.5, fontWeight: 600, color: cr ? '#0c6b4a' : '#161b26' }}>{(cr ? '+ ' : '− ') + money(e.amount, true)}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 12.5, color: '#9aa1ad', width: 96, textAlign: 'right' }}>{money(e.balance, true)}</div>
                </div>
              );
            })}
          </Card>
        </>
      )}

      {/* Ledger */}
      {tab === 'ledger' && (
        <Card className="k-scroll">
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 110px 130px 130px', padding: '11px 20px', borderBottom: '1px solid #eef0f3', fontSize: 11.5, fontWeight: 600, color: '#9aa1ad', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
            <div>Date</div><div>Description</div><div>Type</div><div style={{ textAlign: 'right' }}>Amount</div><div style={{ textAlign: 'right' }}>Balance</div>
          </div>
          {led.map((e, i) => {
            const cr = e.type !== 'DEBIT' && !e.neg;
            const tl = e.type === 'ADJUSTMENT' ? 'Adjustment' : cr ? 'Credit' : 'Debit';
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 110px 130px 130px', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #f2f3f6' }}>
                <div style={{ fontSize: 12.5, color: '#687184', fontFamily: "'IBM Plex Mono'" }}>{e.date}</div>
                <div style={{ fontSize: 13.5, fontWeight: 500, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.desc}</div>
                <div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: '#54607a' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: cr ? '#0c7a52' : '#c5362c', display: 'inline-block' }} />{tl}
                  </span>
                </div>
                <div style={{ textAlign: 'right', fontFamily: "'IBM Plex Mono'", fontSize: 13.5, fontWeight: 600, color: cr ? '#0c6b4a' : '#161b26' }}>{(cr ? '+ ' : '− ') + money(e.amount, true)}</div>
                <div style={{ textAlign: 'right', fontFamily: "'IBM Plex Mono'", fontSize: 13, color: '#54607a' }}>{money(e.balance, true)}</div>
              </div>
            );
          })}
        </Card>
      )}

      {/* Contracts */}
      {tab === 'contracts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {contracts.map(c => {
            const tc = { HOURLY: { label: 'Hourly', bg: '#eaf1fe', fg: '#1f6feb' }, MILESTONE: { label: 'Milestone', bg: '#efecfb', fg: '#6b4ee0' }, SUBSCRIPTION: { label: 'Subscription', bg: '#e0f2f0', fg: '#0c7a72' }, METERED: { label: 'Metered', bg: '#fbf0d9', fg: '#8a5d08' } }[c.type];
            const st = { ACTIVE: { label: 'Active', bg: '#e3f3ec', fg: '#0c6b4a' }, PAUSED: { label: 'Paused', bg: '#fbf0d9', fg: '#8a5d08' }, ENDED: { label: 'Ended', bg: '#eef0f3', fg: '#7a8190' } }[c.status];
            return (
              <div
                key={c.id}
                onClick={() => openContract(c.id)}
                style={{ background: '#fff', border: '1px solid #e7e9ee', borderRadius: 13, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#cfd4dd')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e7e9ee')}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{c.name}</span>
                    <TypeBadge label={tc.label} bg={tc.bg} fg={tc.fg} />
                  </div>
                  <div style={{ fontSize: 12.5, color: '#687184', marginTop: 5 }}>{c.rateSummary} · {c.approval === 'AUTO' ? 'Auto-approve' : 'Manual'} · since {c.start}</div>
                </div>
                <Badge label={st.label} bg={st.bg} fg={st.fg} />
                <Icon name="chevron_right" size={20} color="#c5cad3" />
              </div>
            );
          })}
        </div>
      )}

      {/* Settings */}
      {tab === 'settings' && (
        <div style={{ maxWidth: 660, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card style={{ padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Low-balance alerts</div>
            <p style={{ fontSize: 13, color: '#687184', margin: '0 0 16px' }}>Notify when the wallet drops to or below this amount.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <input defaultValue={money(client.threshold, false)} style={{ flex: 1, height: 42, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 14px', fontSize: 15, fontWeight: 600, fontFamily: "'IBM Plex Mono'" }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, color: '#3f4654', fontWeight: 500, whiteSpace: 'nowrap' }}>
                <span style={{ width: 38, height: 22, borderRadius: 11, background: '#1f6feb', position: 'relative', display: 'inline-block' }}>
                  <span style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', display: 'block' }} />
                </span>
                Notify client
              </label>
            </div>
          </Card>
          <Card style={{ padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Negative-balance policy</div>
            <p style={{ fontSize: 13, color: '#687184', margin: '0 0 16px' }}>What happens when a charge exceeds available funds.</p>
            <div className="rg-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {policyOpts.map(p => {
                const active = client.policy === p.k;
                return (
                  <div
                    key={p.k}
                    style={{ border: `1.5px solid ${active ? '#1f6feb' : '#e7e9ee'}`, background: active ? '#f5f9ff' : '#fff', borderRadius: 12, padding: 15, cursor: 'pointer' }}
                  >
                    <Icon name={p.icon} size={24} color={active ? '#1f6feb' : '#9aa1ad'} />
                    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 9 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: '#687184', marginTop: 3, lineHeight: 1.4 }}>{p.desc}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
