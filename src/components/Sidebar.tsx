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
  me: Me;
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ portalLabel, nav, me, mobile, open, onClose }: Props) {
  const handleNav = (fn: () => void) => { fn(); if (mobile) onClose?.(); };
  return (
    <aside
      className={mobile ? `k-drawer ${open ? 'open' : 'closed'}` : undefined}
      style={{
      flex: '0 0 248px',
      width: 248,
      background: '#fff',
      borderRight: '1px solid #e7e9ee',
      display: 'flex',
      flexDirection: 'column',
      position: mobile ? 'fixed' : 'sticky',
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
              onClick={() => handleNav(item.onClick)}
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

      {/* Bottom — passive "signed in as" identity (logout lives in the header menu) */}
      <div style={{ padding: 12, borderTop: '1px solid #eef0f3' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px' }}>
          <Avatar text={me.initials} bg={me.badgeBg} fg={me.badgeFg} size={30} radius={15} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{me.name}</div>
            <div style={{ fontSize: 11.5, color: '#9aa1ad', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{me.sub}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
