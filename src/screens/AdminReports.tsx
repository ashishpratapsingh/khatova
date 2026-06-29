import { Card } from '../ui';
import { money } from '../data';

const revRaw = [
  { m: 'Jan', c: 2.0, d: 0.8 }, { m: 'Feb', c: 3.5, d: 1.2 }, { m: 'Mar', c: 4.0, d: 2.6 },
  { m: 'Apr', c: 3.0, d: 3.1 }, { m: 'May', c: 6.0, d: 4.1 }, { m: 'Jun', c: 6.0, d: 5.2 },
];
const revMax = 6.0;
const burnRaw = [
  { name: 'Acme Retail', v: 121000 }, { name: 'Cedar Health', v: 85000 }, { name: 'Delta Media', v: 64000 },
  { name: 'Evergreen EdTech', v: 42000 }, { name: 'Bluewave Logistics', v: 10000 },
];
const burnMax = 121000;
const utilRaw = [{ name: 'Anjali Nair', h: 120 }, { name: 'Priya Sharma', h: 86 }, { name: 'Rohan Mehta', h: 64 }];
const utilMax = 120;

export default function AdminReports() {
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
          <div style={{ fontSize: 12.5, color: '#9aa1ad', marginBottom: 20 }}>Last 6 months</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 180, padding: '0 4px' }}>
            {revRaw.map(r => (
              <div key={r.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: '100%', width: '100%', justifyContent: 'center' }}>
                  <div style={{ width: '34%', height: `${(r.c / revMax * 100).toFixed(1)}%`, background: '#1f6feb', borderRadius: '5px 5px 0 0', transformOrigin: 'bottom', animation: 'lgBar .5s ease' }} />
                  <div style={{ width: '34%', height: `${(r.d / revMax * 100).toFixed(1)}%`, background: '#c5362c', borderRadius: '5px 5px 0 0', transformOrigin: 'bottom', animation: 'lgBar .6s ease' }} />
                </div>
                <div style={{ fontSize: 12, color: '#687184', fontWeight: 500 }}>{r.m}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Staff utilization</div>
          <div style={{ fontSize: 12.5, color: '#9aa1ad', marginBottom: 20 }}>Hours logged this month</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
        <div style={{ fontSize: 12.5, color: '#9aa1ad', marginBottom: 20 }}>Average monthly usage billed</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {burnRaw.map(b => (
            <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 150, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</div>
              <div style={{ flex: 1, height: 10, background: '#eef1f6', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(b.v / burnMax * 100).toFixed(1)}%`, background: '#1f6feb', borderRadius: 5 }} />
              </div>
              <div style={{ width: 110, textAlign: 'right', fontSize: 13, fontWeight: 600, fontFamily: "'IBM Plex Mono'" }}>{money(b.v * 100, false)}/mo</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
