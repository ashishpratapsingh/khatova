import { TypeBadge, Icon } from '../ui';
import { money, typeChip, qtyLabel } from '../data';
import { usePagination, Pagination } from '../components/Pagination';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  approve: (id: string) => void;
  openReject: (ev: { id: string; staff: string; desc: string; amountFmt: string }) => void;
}

export default function AdminApprovals({ state, approve, openReject }: Props) {
  const pending = state.events.filter(e => e.status === 'PENDING');
  const paged = usePagination(pending, 6);
  const cName = (id: string) => state.contracts.find(c => c.id === id)?.name || id;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      {pending.length === 0 && (
        <div style={{ background: '#fff', border: '1px solid #e7e9ee', borderRadius: 16, padding: '56px 20px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e3f3ec', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={30} color="#0c6b4a" />
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, marginTop: 16 }}>All caught up</div>
          <div style={{ fontSize: 13.5, color: '#687184', marginTop: 4 }}>No usage events waiting for approval.</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {paged.pageItems.map(ev => {
          const tc = typeChip(ev.type);
          const init = ev.staff.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
          const ql = qtyLabel(ev);
          return (
            <div key={ev.id} style={{ background: '#fff', border: '1px solid #e7e9ee', borderRadius: 14, boxShadow: '0 1px 2px rgba(16,24,40,.03)', padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#efecfb', color: '#6b4ee0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{init}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14.5, fontWeight: 600 }}>{ev.client}</span>
                    <TypeBadge label={tc.label} bg={tc.bg} fg={tc.fg} />
                  </div>
                  <div style={{ fontSize: 13, color: '#3f4654', marginTop: 5 }}>{ev.desc}</div>
                  <div style={{ fontSize: 12.5, color: '#9aa1ad', marginTop: 5 }}>{ev.staff} · {cName(ev.contractId)} · {ql} · {ev.unit} · {ev.date}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 18, fontWeight: 600 }}>{money(ev.amount, false)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14, paddingTop: 14, borderTop: '1px solid #f2f3f6' }}>
                <button
                  onClick={() => openReject({ id: ev.id, staff: ev.staff, desc: ev.desc, amountFmt: money(ev.amount, false) })}
                  style={{ height: 38, border: '1px solid #dcdfe6', background: '#fff', color: '#c5362c', borderRadius: 9, padding: '0 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Reject
                </button>
                <button
                  onClick={() => approve(ev.id)}
                  style={{ height: 38, background: '#0c7a52', color: '#fff', border: 'none', borderRadius: 9, padding: '0 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Icon name="check" size={18} color="#fff" />Approve &amp; bill
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination page={paged.page} totalPages={paged.totalPages} total={paged.total} from={paged.from} to={paged.to} onPage={paged.setPage} label="pending" />
    </div>
  );
}
