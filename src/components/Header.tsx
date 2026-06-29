import { useEffect, useRef, useState } from 'react';
import { Icon, Avatar } from '../ui';

export interface NotifItem {
  id: string;
  icon: string;
  color: string;
  bg: string;
  title: string;
  desc: string;
  read?: boolean;
  onClick?: () => void;
}

interface Props {
  title: string;
  sub: string;
  me: { name: string; sub: string; initials: string; badgeBg: string; badgeFg: string };
  onMenu?: () => void;
  onLogout: () => void;
  notifications: NotifItem[];
  onReadNotif: (id: string) => void;
  onReadAllNotifs: () => void;
  search: string;
  onSearch: (q: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
}

export default function Header({ title, sub, me, onMenu, onLogout, notifications, onReadNotif, onReadAllNotifs, search, onSearch, searchPlaceholder = 'Search…', showSearch = true }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen && !notifOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen, notifOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header style={{
      height: 62,
      flex: '0 0 62px',
      background: '#fff',
      borderBottom: '1px solid #e7e9ee',
      display: 'flex',
      alignItems: 'center',
      padding: '0 18px',
      gap: 14,
      position: 'sticky',
      top: 0,
      zIndex: 5,
    }}>
      {onMenu && (
        <button onClick={onMenu} aria-label="Open menu"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 9, background: '#f1f3f6', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <Icon name="menu" size={22} color="#3f4654" />
        </button>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.3px', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        <div style={{ fontSize: 12.5, color: '#9aa1ad', marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ flex: 1 }} />
      {showSearch && (
        <div className="k-hide-sm" style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, background: '#f1f3f6', borderRadius: 9, padding: '0 12px', width: 230 }}>
          <Icon name="search" size={19} color="#9aa1ad" />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', fontSize: 13, color: '#161b26' }}
          />
          {search && (
            <span onClick={() => onSearch('')} style={{ cursor: 'pointer', display: 'flex' }} aria-label="Clear search">
              <Icon name="close" size={17} color="#9aa1ad" />
            </span>
          )}
        </div>
      )}
      <div ref={notifRef} style={{ position: 'relative' }}>
        <button
          onClick={() => { setNotifOpen(o => !o); setMenuOpen(false); }}
          aria-label="Notifications"
          style={{ position: 'relative', width: 38, height: 38, borderRadius: 9, background: notifOpen ? '#eaf1fe' : '#f1f3f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
        >
          <Icon name="notifications" size={20} color={notifOpen ? '#1f6feb' : '#3f4654'} />
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 17, height: 17, padding: '0 4px', borderRadius: 9, background: '#e0492f', color: '#fff', fontSize: 10.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', fontFamily: "'IBM Plex Mono'" }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 320, maxWidth: '90vw',
            background: '#fff', border: '1px solid #e7e9ee', borderRadius: 12,
            boxShadow: '0 12px 32px rgba(16,24,40,.16)', zIndex: 30, overflow: 'hidden',
            animation: 'lgPop .14s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px', borderBottom: '1px solid #f2f3f6' }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Notifications{unreadCount > 0 ? ` · ${unreadCount} new` : ''}</span>
              {unreadCount > 0 && (
                <button onClick={onReadAllNotifs}
                  style={{ fontSize: 12, fontWeight: 600, color: '#1f6feb', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Read all
                </button>
              )}
            </div>
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {notifications.length === 0 && (
                <div style={{ padding: '30px 16px', textAlign: 'center', color: '#9aa1ad', fontSize: 13 }}>You're all caught up.</div>
              )}
              {notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => { onReadNotif(n.id); setNotifOpen(false); n.onClick?.(); }}
                  style={{ position: 'relative', display: 'flex', gap: 11, padding: '12px 14px 12px 22px', borderBottom: '1px solid #f4f5f7', cursor: 'pointer', background: n.read ? '#fff' : '#f8fbff', opacity: n.read ? 0.62 : 1 }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafbfc')}
                  onMouseLeave={e => (e.currentTarget.style.background = n.read ? '#fff' : '#f8fbff')}
                >
                  {!n.read && <span style={{ position: 'absolute', left: 9, top: 18, width: 7, height: 7, borderRadius: '50%', background: '#1f6feb' }} />}
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={n.icon} size={18} color={n.color} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#161b26' }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: '#687184', marginTop: 2, lineHeight: 1.4 }}>{n.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div ref={menuRef} style={{ position: 'relative' }}>
        <button
          onClick={() => { setMenuOpen(o => !o); setNotifOpen(false); }}
          aria-label="Account menu"
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          <Avatar text={me.initials} bg={me.badgeBg} fg={me.badgeFg} size={36} radius={18} />
          <Icon name="expand_more" size={18} color="#9aa1ad" style={{ transition: 'transform .15s', transform: menuOpen ? 'rotate(180deg)' : 'none' }} />
        </button>

        {menuOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 220,
            background: '#fff', border: '1px solid #e7e9ee', borderRadius: 12,
            boxShadow: '0 12px 32px rgba(16,24,40,.16)', zIndex: 30, overflow: 'hidden',
            animation: 'lgPop .14s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px', borderBottom: '1px solid #f2f3f6' }}>
              <Avatar text={me.initials} bg={me.badgeBg} fg={me.badgeFg} size={36} radius={18} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{me.name}</div>
                <div style={{ fontSize: 12, color: '#9aa1ad', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{me.sub}</div>
              </div>
            </div>
            <button
              onClick={() => { setMenuOpen(false); onLogout(); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 500, color: '#c5362c', textAlign: 'left' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fbf2f1')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Icon name="logout" size={19} color="#c5362c" />Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
