import { Card, Icon } from '../ui';
import { money } from '../data';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  clientId: string;
}

export default function ClientStatement({ state, clientId }: Props) {
  const client = state.clients.find(c => c.id === clientId) || state.clients[0];
  if (!client) return null;
  const bal = state.balances[client.id] ?? client.balance;
  const ledger = state.ledgers[client.id] || [];

  const credited = ledger.filter(e => e.type === 'CREDIT' || e.type === 'ADJUSTMENT').reduce((s, e) => s + e.amount, 0);
  const debited = ledger.filter(e => e.type === 'DEBIT').reduce((s, e) => s + e.amount, 0);
  const opening = bal + debited - credited;

  const summary = [
    { label: 'Opening balance', value: money(opening, false), color: '#161b26' },
    { label: 'Credited', value: money(credited, false), color: '#0c6b4a' },
    { label: 'Debited', value: money(debited, false), color: '#c5362c' },
    { label: 'Closing balance', value: money(bal, false), color: '#1f6feb' },
  ];

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontSize: 13.5, color: '#687184' }}>June 2026 · {client.company}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ height: 36, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 9, padding: '0 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="download" size={17} color="#687184" />CSV
          </button>
          <button style={{ height: 36, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 9, padding: '0 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="picture_as_pdf" size={17} color="#687184" />PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
        {summary.map(s => (
          <Card key={s.label} style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 12, color: '#687184', fontWeight: 500, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'IBM Plex Mono'", color: s.color, letterSpacing: '-0.5px' }}>{s.value}</div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr 1fr 1fr 1fr', padding: '11px 20px', borderBottom: '1px solid #eef0f3', fontSize: 11.5, fontWeight: 600, color: '#9aa1ad', letterSpacing: '0.03em', textTransform: 'uppercase' as const }}>
          <div>Date</div><div>Description</div><div>Type</div><div style={{ textAlign: 'right' }}>Amount</div><div style={{ textAlign: 'right' }}>Balance</div>
        </div>
        {ledger.map((tx, i) => {
          const isCredit = tx.type === 'CREDIT' || tx.type === 'ADJUSTMENT';
          const typeLabel = tx.type === 'CREDIT' ? 'Top-up' : tx.type === 'ADJUSTMENT' ? 'Adjustment' : 'Usage';
          const typeBg = tx.type === 'CREDIT' ? '#e3f3ec' : tx.type === 'ADJUSTMENT' ? '#eaf1fe' : '#fbe9e7';
          const typeFg = tx.type === 'CREDIT' ? '#0c6b4a' : tx.type === 'ADJUSTMENT' ? '#1f6feb' : '#c5362c';
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr 1fr 1fr 1fr', alignItems: 'center', padding: '13px 20px', borderBottom: i < ledger.length - 1 ? '1px solid #f2f3f6' : 'none' }}>
              <div style={{ fontSize: 12.5, color: '#687184' }}>{tx.date}</div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: '#161b26', paddingRight: 12 }}>{tx.desc}</div>
              <div>
                <span style={{ display: 'inline-block', fontSize: 11.5, fontWeight: 600, background: typeBg, color: typeFg, borderRadius: 5, padding: '3px 8px' }}>{typeLabel}</span>
              </div>
              <div style={{ textAlign: 'right', fontFamily: "'IBM Plex Mono'", fontSize: 13.5, fontWeight: 600, color: isCredit ? '#0c6b4a' : '#c5362c' }}>
                {isCredit ? '+' : '-'}{money(tx.amount, false)}
              </div>
              <div style={{ textAlign: 'right', fontFamily: "'IBM Plex Mono'", fontSize: 13, color: '#3f4654' }}>{money(tx.balance, false)}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
