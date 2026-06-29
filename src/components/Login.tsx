import { useState } from 'react';
import { Icon } from '../ui';

interface Props {
  onSubmit: (email: string, password: string) => Promise<void>;
  error: string | null;
}

const DEMO = [
  { label: 'Admin', icon: 'shield_person', color: '#1f6feb', email: 'maya@khatova.app' },
  { label: 'Staff', icon: 'engineering', color: '#6b4ee0', email: 'priya@khatova.app' },
  { label: 'Client', icon: 'person', color: '#0c7a72', email: 'vikram@khatova.app' },
];

export default function Login({ onSubmit, error }: Props) {
  const [email, setEmail] = useState('maya@khatova.app');
  const [password, setPassword] = useState('khatova123');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    try { await onSubmit(email, password); } catch { /* error surfaced via prop */ }
    finally { setBusy(false); }
  };

  return (
    <div className="k-login" style={{ display: 'flex', minHeight: '100vh', animation: 'lgFade .4s ease' }}>
      {/* Left panel */}
      <div className="k-login-aside" style={{
        flex: '0 0 44%',
        background: 'linear-gradient(160deg,#0e1726 0%,#0b1220 60%,#0a1a2e 100%)',
        color: '#fff', padding: '56px 56px 48px', display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.10, backgroundImage: 'repeating-linear-gradient(0deg,#9fc0ff 0,#9fc0ff 1px,transparent 1px,transparent 46px)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: '#1f6feb', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(31,111,235,.45)' }}>
            <Icon name="account_balance_wallet" size={24} color="#fff" />
          </div>
          <span style={{ fontSize: 21, fontWeight: 600, letterSpacing: '-0.4px' }}>Khatova</span>
        </div>
        <div style={{ position: 'relative', marginTop: 'auto' }}>
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5b80c4' }}>Wallet &amp; Billing Platform</div>
          <h1 style={{ fontSize: 38, lineHeight: 1.12, fontWeight: 600, letterSpacing: -1, margin: '18px 0 16px' }}>
            Prepaid wallets,<br />precise billing,<br />one ledger of truth.
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: '#9fb0cc', maxWidth: 380, margin: 0 }}>
            Run client retainers, hourly work, milestones and metered usage on a single append-only ledger. Every paisa accounted for.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontSize: 25, fontWeight: 600, letterSpacing: '-0.5px', margin: '0 0 6px' }}>Sign in</h2>
          <p style={{ fontSize: 14, color: '#687184', margin: '0 0 28px' }}>Welcome back. Enter your credentials to continue.</p>

          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 14, color: '#161b26', background: '#fff', marginBottom: 16, boxSizing: 'border-box' }}
          />
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 14, color: '#161b26', background: '#fff', marginBottom: error ? 10 : 20, boxSizing: 'border-box' }}
          />

          {error && (
            <div style={{ background: '#fbe9e7', color: '#b5362b', fontSize: 13, fontWeight: 500, borderRadius: 9, padding: '10px 12px', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            onClick={submit}
            disabled={busy}
            style={{ width: '100%', height: 45, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.7 : 1, boxShadow: '0 4px 12px rgba(31,111,235,.28)' }}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '26px 0 18px' }}>
            <div style={{ flex: 1, height: 1, background: '#e7e9ee' }} />
            <span style={{ fontSize: 11.5, color: '#9aa1ad', fontWeight: 500 }}>DEMO ACCOUNTS — PASSWORD khatova123</span>
            <div style={{ flex: 1, height: 1, background: '#e7e9ee' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {DEMO.map(({ label, icon, color, email: e }) => (
              <button
                key={label}
                onClick={() => { setEmail(e); setPassword('khatova123'); }}
                style={{ border: '1px solid #dcdfe6', background: '#fff', borderRadius: 10, padding: '12px 6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
              >
                <Icon name={icon} size={22} color={color} />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#161b26' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
