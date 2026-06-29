import { useEffect, useState } from 'react';

/** Client-side pagination over an already-loaded list. */
export function usePagination<T>(items: T[], pageSize = 8, resetKey?: unknown) {
  const [page, setPage] = useState(1);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Jump back to page 1 when the source list identity changes (e.g. a new search).
  useEffect(() => { setPage(1); }, [resetKey]);

  const cur = Math.min(page, totalPages);
  const start = (cur - 1) * pageSize;
  return {
    page: cur,
    setPage,
    totalPages,
    total,
    pageSize,
    pageItems: items.slice(start, start + pageSize),
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + pageSize, total),
  };
}

function pageList(page: number, totalPages: number): (number | '…')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const out: (number | '…')[] = [1];
  const lo = Math.max(2, page - 1);
  const hi = Math.min(totalPages - 1, page + 1);
  if (lo > 2) out.push('…');
  for (let i = lo; i <= hi; i++) out.push(i);
  if (hi < totalPages - 1) out.push('…');
  out.push(totalPages);
  return out;
}

interface Props {
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  onPage: (p: number) => void;
  label?: string;
}

export function Pagination({ page, totalPages, total, from, to, onPage, label = 'items' }: Props) {
  if (total === 0) return null;

  const navBtn = (content: React.ReactNode, target: number, disabled: boolean, active = false): React.ReactNode => (
    <button
      onClick={() => !disabled && onPage(target)}
      disabled={disabled}
      style={{
        minWidth: 32, height: 32, padding: '0 8px', borderRadius: 8,
        border: `1px solid ${active ? '#1f6feb' : '#dcdfe6'}`,
        background: active ? '#1f6feb' : '#fff',
        color: active ? '#fff' : disabled ? '#c5cad3' : '#3f4654',
        fontSize: 13, fontWeight: 600, cursor: disabled ? 'default' : 'pointer',
        fontFamily: "'IBM Plex Mono'", display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {content}
    </button>
  );

  return (
    <div className="k-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 14 }}>
      <div style={{ fontSize: 12.5, color: '#9aa1ad' }}>
        Showing <strong style={{ color: '#3f4654' }}>{from}–{to}</strong> of {total} {label}
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {navBtn('‹', page - 1, page <= 1)}
          {pageList(page, totalPages).map((p, i) =>
            p === '…'
              ? <span key={`e${i}`} style={{ color: '#9aa1ad', padding: '0 2px' }}>…</span>
              : <span key={p}>{navBtn(p, p, false, p === page)}</span>,
          )}
          {navBtn('›', page + 1, page >= totalPages)}
        </div>
      )}
    </div>
  );
}
