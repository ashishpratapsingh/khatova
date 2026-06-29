import { Card } from '../ui';
import { money } from '../data';
import type { AppState, LedgerEntry } from '../types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Props { state: AppState; }

export default function AdminReports({ state }: Props) {
  const allLedger: LedgerEntry[] = Object.values(state.ledgers).flat();

  // Revenue: credits vs debits by month (paise), last 6 months present in data
  const byMonth = new Map<string, { c: number; d: number; idx: number; year: number }>();
  for (const e of allLedger) {
    const dt = new Date(e.date);
    if (isNaN(dt.getTime())) continue;
    const key = `${dt.getFullYear()}-${dt.getMonth()}`;
    const slot = byMonth.get(key) || { c: 0, d: 0, idx: dt.getMonth(), year: dt.getFullYear() };
    const isCredit = e.type === 'CREDIT' || (e.type === 'ADJUSTMENT' && !e.neg);
    if (isCredit) slot.c += e.amount; else slot.d += e.amount;
    byMonth.set(key, slot);
  }
  const revRaw = [...byMonth.entries()]
    .sort((a, b) => a[1].year - b[1].year || a[1].idx - b[1].idx)
    .slice(-6)
    .map(([, v]) => ({ m: MONTHS[v.idx], c: v.c / 100, d: v.d / 100 }));
  const revMax = Math.max(1, ...revRaw.flatMap(r => [r.c, r.d]));

  // Burn rate by client (billed usage)
  const burnMap = new Map<string, number>();
  for (const e of state.events) {
    if (e.status !== 'BILLED') continue;
    burnMap.set(e.client, (burnMap.get(e.client) || 0) + e.amount);
  }
  const burnRaw = [...burnMap.entries()].map(([name, v]) => ({ name, v })).sort((a, b) => b.v - a.v);
  const burnMax = Math.max(1, ...burnRaw.map(b => b.v));

  // Staff utilization (hours on HOURLY events)
  const utilMap = new Map<string, number>();
  for (const e of state.events) {
    if (e.type !== 'HOURLY') continue;
    utilMap.set(e.staff, (utilMap.get(e.staff) || 0) + e.qty);
  }
  const utilRaw = [...utilMap.entries()].map(([name, h]) => ({ name, h })).sort((a, b) => b.h - a.h);
  const utilMax = Math.max(1, ...utilRaw.map(u => u.h));

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, alignItems: 'start', marginBottom: 18 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Revenue — credits vs debits</div>
            <div style={{ display: 'flex', gap: 14 }}>
              {[['#1f6feb', 'Top-ups'], ['#c5362c', 'Usage']].map(([color, label]) => (
                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#687184' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: color, display: 'inline-block' }} />{label}
                </span>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 12.5, color: '#9aa1ad', marginBottom: 20 }}>By month</div>
          {revRaw.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#9aa1ad', fontSize: 13 }}>No ledger activity yet.</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 180, padding: '0 4px' }}>
              {revRaw.map((r, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: '100%', width: '100%', justifyContent: 'center' }}>
                    <div style={{ width: '34%', height: `${(r.c / revMax * 100).toFixed(1)}%`, background: '#1f6feb', borderRadius: '5px 5px 0 0' }} />
                    <div style={{ width: '34%', height: `${(r.d / revMax * 100).toFixed(1)}%`, background: '#c5362c', borderRadius: '5px 5px 0 0' }} />
                  </div>
                  <div style={{ fontSize: 12, color: '#687184', fontWeight: 500 }}>{r.m}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Staff utilization</div>
          <div style={{ fontSize: 12.5, color: '#9aa1ad', marginBottom: 20 }}>Hours logged</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {utilRaw.length === 0 && <div style={{ color: '#9aa1ad', fontSize: 13 }}>No hourly usage yet.</div>}
            {utilRaw.map(u => (
              <div key={u.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'IBM Plex Mono'" }}>{u.h} h</span>
                </div>
                <div style={{ height: 8, background: '#eef1f6', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(u.h / utilMax * 100).toFixed(1)}%`, background: '#6b4ee0', borderRadius: 5 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ padding: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Burn rate by client</div>
        <div style={{ fontSize: 12.5, color: '#9aa1ad', marginBottom: 20 }}>Total usage billed</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {burnRaw.length === 0 && <div style={{ color: '#9aa1ad', fontSize: 13 }}>No billed usage yet.</div>}
          {burnRaw.map(b => (
            <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 150, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</div>
              <div style={{ flex: 1, height: 10, background: '#eef1f6', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(b.v / burnMax * 100).toFixed(1)}%`, background: '#1f6feb', borderRadius: 5 }} />
              </div>
              <div style={{ width: 110, textAlign: 'right', fontSize: 13, fontWeight: 600, fontFamily: "'IBM Plex Mono'" }}>{money(b.v, false)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
