import { Icon } from '../ui';
import { money } from '../data';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  clientId: string;
}

export default function ClientWallet({ state, clientId }: Props) {
  const client = state.clients.find(c => c.id === clientId) || state.clients[0];
  if (!client) return null;
  const bal = state.balances[client.id] ?? client.balance;
  const ledger = (state.ledgers[client.id] || []).slice(0, 8);
  const spent = ledger.filter(e => e.type === 'DEBIT').reduce((s, e) => s + e.amount, 0);
  const activeContracts = state.contracts.filter(c => c.status === 'ACTIVE').length;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <div style={{ background: 'linear-gradient(135deg,#0e1726,#15243c)', borderRadius: 20, padding: '30px 28px', marginBottom: 20, color: '#fff' }}>
        <div className="k-wrap" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
          <div>
            <div style={{ fontSize: 13, color: '#9fb0cc', fontWeight: 500, marginBottom: 6 }}>Wallet balance</div>
            <div style={{ fontSize: 38, fontWeight: 700, fontFamily: "'IBM Plex Mono'", letterSpacing: '-1px', lineHeight: 1 }}>{money(bal, false)}</div>
            <div style={{ fontSize: 12.5, color: '#9fb0cc', marginTop: 10 }}>{client.company}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, height: 42, background: 'rgba(255,255,255,.08)', color: '#cdd9ee', borderRadius: 10, padding: '0 16px', fontSize: 13 }}>
            <Icon name="info" size={18} color="#9fb0cc" />Contact your account manager to add funds
          </div>
        </div>

        <div className="rg-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 28 }}>
          {[
            { label: 'Spent (recent)', value: money(spent, false) },
            { label: 'Active contracts', value: String(activeContracts) },
            { label: 'Alert threshold', value: money(client.threshold, false) },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,.07)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, color: '#9fb0cc', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'IBM Plex Mono'" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, color: '#3f4654', marginBottom: 12 }}>Recent transactions</div>
      <div style={{ background: '#fff', border: '1px solid #e7e9ee', borderRadius: 14, overflow: 'hidden' }}>
        {ledger.map((tx, i) => {
          const isCredit = tx.type === 'CREDIT' || tx.type === 'ADJUSTMENT';
          const iconName = isCredit ? 'add_circle' : 'arrow_upward';
          const iconColor = isCredit ? '#0c6b4a' : '#c5362c';
          const iconBg = isCredit ? '#e3f3ec' : '#fbe9e7';
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < ledger.length - 1 ? '1px solid #f2f3f6' : 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={iconName} size={20} color={iconColor} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: '#161b26' }}>{tx.desc}</div>
                <div style={{ fontSize: 12, color: '#9aa1ad', marginTop: 2 }}>{tx.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 14, fontWeight: 600, color: isCredit ? '#0c6b4a' : '#c5362c' }}>
                  {isCredit ? '+' : '-'}{money(tx.amount, false)}
                </div>
                <div style={{ fontSize: 12, color: '#9aa1ad', marginTop: 2 }}>{money(tx.balance, false)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
