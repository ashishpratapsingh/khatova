import { Card, Badge, Avatar, Icon } from '../ui';

interface Props {
  openAddUser: () => void;
}

const USERS = [
  { name: 'Maya Kapoor', email: 'maya@northwind.co', role: 'ADMIN', status: 'ACTIVE', last: 'Online now' },
  { name: 'Priya Sharma', email: 'priya@northwind.co', role: 'STAFF', status: 'ACTIVE', last: '2h ago' },
  { name: 'Rohan Mehta', email: 'rohan@northwind.co', role: 'STAFF', status: 'ACTIVE', last: '1d ago' },
  { name: 'Anjali Nair', email: 'anjali@northwind.co', role: 'STAFF', status: 'INVITED', last: 'Invite sent' },
  { name: 'Vikram Rao', email: 'vikram@acmeretail.in', role: 'CLIENT', status: 'ACTIVE', last: '2h ago' },
  { name: 'Sana Iqbal', email: 'sana@bluewave.in', role: 'CLIENT', status: 'ACTIVE', last: '1d ago' },
  { name: 'Karan Bose', email: 'karan@evergreen.edu', role: 'CLIENT', status: 'SUSPENDED', last: 'Suspended' },
];

const roleChip = (r: string) => ({ ADMIN: { label: 'Admin', bg: '#eaf1fe', fg: '#1f6feb' }, STAFF: { label: 'Staff', bg: '#efecfb', fg: '#6b4ee0' }, CLIENT: { label: 'Client', bg: '#e0f2f0', fg: '#0c7a72' } }[r] || { label: r, bg: '#eef0f3', fg: '#7a8190' });
const stChip = (s: string) => ({ ACTIVE: { label: 'Active', bg: '#e3f3ec', fg: '#0c6b4a' }, INVITED: { label: 'Invited', bg: '#fbf0d9', fg: '#8a5d08' }, SUSPENDED: { label: 'Suspended', bg: '#fbe9e7', fg: '#b5362b' } }[s] || { label: s, bg: '#eef0f3', fg: '#7a8190' });
const inits = (name: string) => name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();

export default function AdminTeam({ openAddUser }: Props) {
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 6, background: '#fff', border: '1px solid #e7e9ee', borderRadius: 10, padding: 4 }}>
          {['Everyone', 'Staff', 'Clients', 'Admins'].map((f, i) => (
            <span key={f} style={{ fontSize: 12.5, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? '#1f6feb' : '#687184', background: i === 0 ? '#eaf1fe' : 'transparent', padding: '6px 12px', borderRadius: 7, cursor: 'pointer' }}>{f}</span>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={openAddUser}
          style={{ height: 38, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 9, padding: '0 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(31,111,235,.22)' }}
        >
          <Icon name="person_add" size={19} color="#fff" />Invite user
        </button>
      </div>

      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1.1fr', padding: '11px 20px', borderBottom: '1px solid #eef0f3', fontSize: 11.5, fontWeight: 600, color: '#9aa1ad', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
          <div>User</div><div>Role</div><div>Status</div><div style={{ textAlign: 'right' }}>Last active</div>
        </div>
        {USERS.map(u => {
          const rc = roleChip(u.role);
          const sc = stChip(u.status);
          return (
            <div key={u.email} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1.1fr', alignItems: 'center', padding: '13px 20px', borderBottom: '1px solid #f2f3f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <Avatar text={inits(u.name)} size={36} radius={18} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: '#9aa1ad' }}>{u.email}</div>
                </div>
              </div>
              <div><Badge label={rc.label} bg={rc.bg} fg={rc.fg} style={{ borderRadius: 6 }} /></div>
              <div><Badge label={sc.label} bg={sc.bg} fg={sc.fg} /></div>
              <div style={{ textAlign: 'right', fontSize: 12.5, color: '#687184' }}>{u.last}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
