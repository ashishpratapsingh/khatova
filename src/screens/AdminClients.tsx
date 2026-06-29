import { useState } from 'react';
import { Card, Badge, Avatar, Icon } from '../ui';
import { ModalShell } from '../components/Modal';
import { money, walletStatus } from '../data';
import { useApp } from '../lib/store';
import type { AppState, ClientStatus } from '../types';

interface Props {
  state: AppState;
  openClient: (id: string) => void;
  openTopup: (id: string) => void;
  openNewClient: () => void;
}

const FILTERS: Array<{ label: string; key: ClientStatus | 'ALL' }> = [
  { label: 'All', key: 'ALL' }, { label: 'Healthy', key: 'HEALTHY' },
  { label: 'Low', key: 'LOW' }, { label: 'Negative', key: 'NEGATIVE' },
];

const GRID = '40px 2fr 1.5fr 1.1fr 1fr 116px';

export default function AdminClients({ state, openClient, openTopup, openNewClient }: Props) {
  const { search, setSearch, deleteClients } = useApp();
  const [filter, setFilter] = useState<ClientStatus | 'ALL'>('ALL');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const q = search.trim().toLowerCase();

  const rows = state.clients
    .map(c => {
      const b = state.balances[c.id];
      const st = walletStatus(b, c.threshold);
      return { ...c, balance: b, balanceFmt: money(b, false), balanceColor: b < 0 ? '#b5362b' : '#161b26', st };
    })
    .filter(c => filter === 'ALL' || c.st.key === filter)
    .filter(c => !q || c.company.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));

  const selectedRows = rows.filter(r => selected.has(r.id));
  const selectedIds = selectedRows.map(r => r.id);
  const selCount = selectedIds.length;
  const allSelected = rows.length > 0 && rows.every(r => selected.has(r.id));

  const toggle = (id: string) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const toggleAll = () => setSelected(prev => {
    if (rows.every(r => prev.has(r.id))) {
      const next = new Set(prev); rows.forEach(r => next.delete(r.id)); return next;
    }
    const next = new Set(prev); rows.forEach(r => next.add(r.id)); return next;
  });
  const clearSel = () => setSelected(new Set());

  const confirmDelete = async () => {
    setBusy(true);
    try { await deleteClients(selectedIds); clearSel(); setConfirming(false); }
    finally { setBusy(false); }
  };

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', animation: 'lgFade .25s ease' }}>
      <div className="k-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 6, background: '#fff', border: '1px solid #e7e9ee', borderRadius: 10, padding: 4 }}>
          {FILTERS.map(f => {
            const active = filter === f.key;
            return (
              <span key={f.key} onClick={() => setFilter(f.key)}
                style={{ fontSize: 12.5, fontWeight: active ? 600 : 500, color: active ? '#1f6feb' : '#687184', background: active ? '#eaf1fe' : 'transparent', padding: '6px 12px', borderRadius: 7, cursor: 'pointer' }}>{f.label}</span>
            );
          })}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, background: '#fff', border: '1px solid #e7e9ee', borderRadius: 9, padding: '0 12px', width: 220 }}>
          <Icon name="search" size={19} color="#9aa1ad" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients…"
            style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', fontSize: 13, color: '#161b26' }} />
          {search && <span onClick={() => setSearch('')} style={{ cursor: 'pointer', display: 'flex' }}><Icon name="close" size={16} color="#9aa1ad" /></span>}
        </div>
        <button
          onClick={openNewClient}
          style={{ height: 38, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 9, padding: '0 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(31,111,235,.22)' }}
        >
          <Icon name="add" size={19} color="#fff" />New client
        </button>
      </div>

      {/* Bulk action bar */}
      {selCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#eaf1fe', border: '1px solid #cfe0fd', borderRadius: 10, padding: '10px 16px', marginBottom: 14 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1f4f9e' }}>{selCount} selected</span>
          <button onClick={clearSel} style={{ fontSize: 12.5, fontWeight: 500, color: '#1f6feb', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => setConfirming(true)}
            style={{ height: 34, background: '#c5362c', color: '#fff', border: 'none', borderRadius: 8, padding: '0 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Icon name="delete" size={17} color="#fff" />Delete
          </button>
        </div>
      )}

      <Card className="k-scroll">
        <div style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', padding: '11px 20px', borderBottom: '1px solid #eef0f3', fontSize: 11.5, fontWeight: 600, color: '#9aa1ad', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" checked={allSelected} onChange={toggleAll}
              aria-label="Select all" style={{ width: 16, height: 16, accentColor: '#1f6feb', cursor: 'pointer' }} />
          </div>
          <div>Client</div><div>Billing email</div><div style={{ textAlign: 'right' }}>Balance</div><div style={{ textAlign: 'center' }}>Status</div><div />
        </div>
        {rows.length === 0 && (
          <div style={{ padding: '34px 20px', textAlign: 'center', fontSize: 13.5, color: '#9aa1ad' }}>No clients match your search.</div>
        )}
        {rows.map(c => {
          const checked = selected.has(c.id);
          return (
            <div
              key={c.id}
              onClick={() => openClient(c.id)}
              style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #f2f3f6', cursor: 'pointer', background: checked ? '#f5f9ff' : 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = checked ? '#eef5ff' : '#fafbfc')}
              onMouseLeave={e => (e.currentTarget.style.background = checked ? '#f5f9ff' : 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center' }} onClick={ev => ev.stopPropagation()}>
                <input type="checkbox" checked={checked} onChange={() => toggle(c.id)}
                  aria-label={`Select ${c.company}`} style={{ width: 16, height: 16, accentColor: '#1f6feb', cursor: 'pointer' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <Avatar text={c.initials} size={36} radius={9} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.company}</div>
                  <div style={{ fontSize: 12, color: '#9aa1ad' }}>{c.contact}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#687184', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.email}</div>
              <div style={{ textAlign: 'right', fontFamily: "'IBM Plex Mono'", fontSize: 14, fontWeight: 600, color: c.balanceColor }}>{c.balanceFmt}</div>
              <div style={{ textAlign: 'center' }}><Badge label={c.st.label} bg={c.st.bg} fg={c.st.fg} /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={ev => { ev.stopPropagation(); openTopup(c.id); }}
                  style={{ border: '1px solid #dcdfe6', background: '#fff', color: '#1f6feb', fontSize: 12, fontWeight: 600, padding: '6px 11px', borderRadius: 8, cursor: 'pointer' }}
                >
                  Top up
                </button>
              </div>
            </div>
          );
        })}
      </Card>

      {confirming && (
        <ModalShell title="Delete clients" onClose={() => !busy && setConfirming(false)}>
          <p style={{ fontSize: 13.5, color: '#3f4654', margin: '2px 0 12px', lineHeight: 1.5 }}>
            {selCount === 1 ? (
              <>Delete <strong>{selectedRows[0]?.company}</strong>? This also removes their contracts, usage events and ledger history.</>
            ) : (
              <>Delete these <strong>{selCount}</strong> clients? This also removes their contracts, usage events and ledger history.</>
            )}
          </p>
          {selCount > 1 && (
            <div style={{ maxHeight: 168, overflowY: 'auto', background: '#f8f9fb', border: '1px solid #eef0f3', borderRadius: 10, padding: '6px 4px', margin: '0 0 14px' }}>
              {selectedRows.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 10px' }}>
                  <Avatar text={c.initials} size={26} radius={7} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.company}</div>
                    <div style={{ fontSize: 11.5, color: '#9aa1ad' }}>{c.balanceFmt}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p style={{ fontSize: 12.5, color: '#b5362b', margin: '0 0 20px' }}>This action cannot be undone.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setConfirming(false)} disabled={busy} style={{ flex: 1, height: 42, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button onClick={confirmDelete} disabled={busy} style={{ flex: 2, height: 42, background: '#c5362c', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
              {busy ? 'Deleting…' : `Delete ${selCount} client${selCount === 1 ? '' : 's'}`}
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
