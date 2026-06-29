import { Icon } from '../ui';

interface Props {
  onLoginAdmin: () => void;
  onLoginStaff: () => void;
  onLoginClient: () => void;
}

export default function Login({ onLoginAdmin, onLoginStaff, onLoginClient }: Props) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', animation: 'lgFade .4s ease' }}>
      {/* Left panel */}
      <div style={{
        flex: '0 0 44%',
        background: 'linear-gradient(160deg,#0e1726 0%,#0b1220 60%,#0a1a2e 100%)',
        color: '#fff',
        padding: '56px 56px 48px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
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
          <div style={{ display: 'flex', gap: 28, marginTop: 34 }}>
            {[['3', 'Portals'], ['4', 'Contract types'], ['∞', 'Audit trail']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "'IBM Plex Mono'" }}>{n}</div>
                <div style={{ fontSize: 12.5, color: '#7e91b3', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontSize: 25, fontWeight: 600, letterSpacing: '-0.5px', margin: '0 0 6px' }}>Sign in</h2>
          <p style={{ fontSize: 14, color: '#687184', margin: '0 0 28px' }}>Welcome back. Enter your credentials to continue.</p>

          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Email</label>
          <input
            defaultValue="maya@northwind.co"
            style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 14, color: '#161b26', background: '#fff', marginBottom: 16 }}
          />
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#3f4654', marginBottom: 7 }}>Password</label>
          <input
            type="password"
            defaultValue="demopassword"
            style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 14, color: '#161b26', background: '#fff', marginBottom: 20 }}
          />
          <button
            onClick={onLoginAdmin}
            style={{ width: '100%', height: 45, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(31,111,235,.28)' }}
          >
            Sign in
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '26px 0 18px' }}>
            <div style={{ flex: 1, height: 1, background: '#e7e9ee' }} />
            <span style={{ fontSize: 12, color: '#9aa1ad', fontWeight: 500 }}>DEMO ACCESS — JUMP TO A PORTAL</span>
            <div style={{ flex: 1, height: 1, background: '#e7e9ee' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { label: 'Admin', icon: 'shield_person', color: '#1f6feb', onClick: onLoginAdmin },
              { label: 'Staff', icon: 'engineering', color: '#6b4ee0', onClick: onLoginStaff },
              { label: 'Client', icon: 'person', color: '#0c7a72', onClick: onLoginClient },
            ].map(({ label, icon, color, onClick }) => (
              <button
                key={label}
                onClick={onClick}
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
