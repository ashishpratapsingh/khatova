import { TypeBadge, Badge, Icon } from '../ui';
import { money, typeChip, CONTRACT_RATES, CONTRACTS } from '../data';

export default function ClientContracts() {
  const myContracts = CONTRACTS.filter(c => c.clientId === 'c_acme');

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {myContracts.map(c => {
          const tc = typeChip(c.type);
          const rates = CONTRACT_RATES[c.id];
          const statusBg = c.status === 'ACTIVE' ? '#e3f3ec' : '#eef0f3';
          const statusFg = c.status === 'ACTIVE' ? '#0c6b4a' : '#7a8190';
          return (
            <div key={c.id} style={{ background: '#fff', border: '1px solid #e7e9ee', borderRadius: 16, boxShadow: '0 1px 2px rgba(16,24,40,.03)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 22px', borderBottom: '1px solid #f2f3f6' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 600 }}>{c.name}</span>
                      <TypeBadge label={tc.label} bg={tc.bg} fg={tc.fg} />
                      <Badge label={c.status} bg={statusBg} fg={statusFg} />
                    </div>
                    <div style={{ fontSize: 12.5, color: '#687184' }}>Started {c.start}{c.end !== '—' ? ` · Ends ${c.end}` : ''} · {c.approval === 'AUTO' ? 'Auto-approved' : 'Manual approval'}</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '18px 22px' }}>
                {rates?.kind === 'roles' && (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#9aa1ad', textTransform: 'uppercase' as const, letterSpacing: '0.04em', marginBottom: 12 }}>Rate card</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {rates.rows?.map(row => (
                        <div key={row.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8f9fb', borderRadius: 10 }}>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 500 }}>{row.label}</div>
                            <div style={{ fontSize: 12, color: '#9aa1ad', marginTop: 2 }}>{row.sub}</div>
                          </div>
                          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 15, fontWeight: 600, color: '#1f6feb' }}>{money(row.amount, false)}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {rates?.kind === 'sub' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8f9fb', borderRadius: 10 }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 500 }}>Monthly retainer</div>
                      <div style={{ fontSize: 12, color: '#9aa1ad', marginTop: 2 }}>Billed on the {rates.day}st of each month</div>
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 15, fontWeight: 600, color: '#1f6feb' }}>{money(rates.amount || 0, false)}/mo</div>
                  </div>
                )}
                {rates?.kind === 'milestones' && (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#9aa1ad', textTransform: 'uppercase' as const, letterSpacing: '0.04em', marginBottom: 12 }}>Milestones</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {rates.rows?.map(row => (
                        <div key={row.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8f9fb', borderRadius: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: row.done ? '#e3f3ec' : '#eef0f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Icon name={row.done ? 'check' : 'schedule'} size={15} color={row.done ? '#0c6b4a' : '#9aa1ad'} />
                            </div>
                            <div style={{ fontSize: 13.5, fontWeight: 500, color: row.done ? '#687184' : '#161b26', textDecoration: row.done ? 'line-through' : 'none' }}>{row.label}</div>
                          </div>
                          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 15, fontWeight: 600, color: row.done ? '#9aa1ad' : '#1f6feb' }}>{money(row.amount, false)}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {rates?.kind === 'units' && (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#9aa1ad', textTransform: 'uppercase' as const, letterSpacing: '0.04em', marginBottom: 12 }}>Unit pricing</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {rates.rows?.map(row => (
                        <div key={row.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8f9fb', borderRadius: 10 }}>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 500 }}>{row.label}</div>
                            <div style={{ fontSize: 12, color: '#9aa1ad', marginTop: 2 }}>{row.sub}</div>
                          </div>
                          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 15, fontWeight: 600, color: '#1f6feb' }}>{money(row.amount, false)}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
