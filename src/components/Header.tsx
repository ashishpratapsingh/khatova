import { Icon, Avatar } from '../ui';

interface Props {
  title: string;
  sub: string;
  me: { initials: string; badgeBg: string; badgeFg: string };
}

export default function Header({ title, sub, me }: Props) {
  return (
    <header style={{
      height: 62,
      flex: '0 0 62px',
      background: '#fff',
      borderBottom: '1px solid #e7e9ee',
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      gap: 18,
      position: 'sticky',
      top: 0,
      zIndex: 5,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.3px', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        <div style={{ fontSize: 12.5, color: '#9aa1ad', marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, background: '#f1f3f6', borderRadius: 9, padding: '0 12px', width: 230 }}>
        <Icon name="search" size={19} color="#9aa1ad" />
        <span style={{ fontSize: 13, color: '#9aa1ad' }}>Search…</span>
      </div>
      <div style={{ position: 'relative', width: 38, height: 38, borderRadius: 9, background: '#f1f3f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <Icon name="notifications" size={20} color="#3f4654" />
        <span style={{ position: 'absolute', top: 7, right: 8, width: 7, height: 7, borderRadius: '50%', background: '#e0492f', border: '1.5px solid #f1f3f6' }} />
      </div>
      <Avatar text={me.initials} bg={me.badgeBg} fg={me.badgeFg} size={36} radius={18} />
    </header>
  );
}
