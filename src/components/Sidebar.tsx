import { Icon, Avatar } from '../ui';
import type { Route } from '../types';

interface NavItem {
  icon: string;
  label: string;
  route: Route;
  active: boolean;
  badge?: number;
  onClick: () => void;
}

interface PortalSwitch {
  label: string;
  active: boolean;
  onClick: () => void;
}

interface Me {
  name: string;
  sub: string;
  initials: string;
  badgeBg: string;
  badgeFg: string;
}

interface Props {
  portalLabel: string;
  nav: NavItem[];
  portalSwitch: PortalSwitch[];
  me: Me;
  onLogout: () => void;
}

export default function Sidebar({ portalLabel, nav, portalSwitch, me, onLogout }: Props) {
  return (
    <aside style={{
      flex: '0 0 248px',
      background: '#fff',
      borderRight: '1px solid #e7e9ee',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 18px 14px', display: 'flex', alignItems: 'center', gap: 11, borderBottom: '1px solid #eef0f3' }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: '#1f6feb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="account_balance_wallet" size={21} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.3px', lineHeight: 1 }}>Khatova</div>
          <div style={{ fontSize: 11, color: '#9aa1ad', marginTop: 3 }}>Northwind Studio</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: '10px 12px 8px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#9aa1ad', padding: '6px 10px 8px' }}>
          {portalLabel}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {nav.map(item => (
            <button
              key={item.route}
              onClick={item.onClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '9px 11px',
                borderRadius: 9,
                cursor: 'pointer',
                fontSize: 13.5,
                fontWeight: item.active ? 600 : 500,
                color: item.active ? '#1f6feb' : '#3f4654',
                background: item.active ? '#eaf1fe' : 'transparent',
                border: 'none',
                textAlign: 'left',
                transition: 'background 0.12s',
                width: '100%',
              }}
            >
              <Icon name={item.icon} size={20} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span style={{
                  background: '#1f6feb',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  minWidth: 19,
                  height: 19,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 5px',
                  fontFamily: "'IBM Plex Mono'",
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: '#9aa1ad', padding: '0 4px 8px' }}>
          DEMO · VIEW AS
        </div>
        <div style={{ display: 'flex', background: '#f1f3f6', borderRadius: 9, padding: 3, gap: 2 }}>
          {portalSwitch.map(p => (
            <button
              key={p.label}
              onClick={p.onClick}
              style={{
                flex: 1,
                border: 'none',
                borderRadius: 7,
                padding: '7px 0',
                fontSize: 12,
                fontWeight: p.active ? 600 : 500,
                cursor: 'pointer',
                color: p.active ? '#161b26' : '#687184',
                background: p.active ? '#fff' : 'transparent',
                boxShadow: p.active ? '0 1px 2px rgba(16,24,40,.12)' : 'none',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div
          onClick={onLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 8px', marginTop: 8, borderRadius: 9, cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f1f3f6')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Avatar text={me.initials} bg={me.badgeBg} fg={me.badgeFg} size={30} radius={15} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{me.name}</div>
            <div style={{ fontSize: 11.5, color: '#9aa1ad', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{me.sub}</div>
          </div>
          <Icon name="logout" size={18} color="#9aa1ad" />
        </div>
      </div>
    </aside>
  );
}
