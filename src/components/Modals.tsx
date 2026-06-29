import { ModalShell, MRow } from './Modal';
import { money, CLIENTS } from '../data';
import type { AppState } from '../types';

interface BaseProps {
  state: AppState;
  onClose: () => void;
}

// Top-up modal
export function TopupModal({ state, onClose, onSubmit }: BaseProps & { onSubmit: () => void }) {
  const clientId = state.modalData?.clientId || 'c_acme';
  const client = CLIENTS.find(c => c.id === clientId);
  const bal = state.balances[clientId] ?? 0;
  const amt = parseFloat(state.topAmount || '0') * 100 || 0;

  return (
    <ModalShell title="Add funds" onClose={onClose}>
      <p style={{ fontSize: 13, color: '#687184', margin: '2px 0 20px' }}>
        Credit the wallet for <strong>{client?.company}</strong>
      </p>

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Amount (₹)</label>
      <input
        type="number"
        value={state.topAmount}
        readOnly
        placeholder="0"
        style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 17, fontWeight: 700, fontFamily: "'IBM Plex Mono'", marginBottom: 14, boxSizing: 'border-box' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
        {['10,000', '25,000', '1,00,000'].map(v => (
          <button key={v} style={{ height: 36, border: '1px solid #dcdfe6', background: '#f8f9fb', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#3f4654' }}>₹{v}</button>
        ))}
      </div>

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Payment method</label>
      <select
        defaultValue={state.topMethod || 'bank'}
        style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 13.5, background: '#fff', marginBottom: 14 }}
      >
        <option value="bank">Bank Transfer (NEFT/RTGS)</option>
        <option value="upi">UPI</option>
        <option value="card">Card</option>
      </select>

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Reference / UTR</label>
      <input
        value={state.topRef}
        readOnly
        placeholder="UTR or transaction ref"
        style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 13.5, marginBottom: 18, boxSizing: 'border-box' }}
      />

      <div style={{ background: '#f5f9ff', border: '1px solid #d8e6fd', borderRadius: 10, padding: '12px 14px', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <MRow label="Current balance">{money(bal, false)}</MRow>
        <MRow label="Top-up amount">+{money(amt, false)}</MRow>
        <div style={{ borderTop: '1px solid #d8e6fd', margin: '4px 0' }} />
        <MRow label="New balance"><span style={{ color: '#1f6feb' }}>{money(bal + amt, false)}</span></MRow>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, height: 42, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
        <button onClick={onSubmit} style={{ flex: 2, height: 42, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(31,111,235,.25)' }}>Confirm top-up</button>
      </div>
    </ModalShell>
  );
}

// Adjust modal
export function AdjustModal({ state, onClose, onSubmit }: BaseProps & { onSubmit: () => void }) {
  const clientId = state.modalData?.clientId || 'c_acme';
  const client = CLIENTS.find(c => c.id === clientId);
  const bal = state.balances[clientId] ?? 0;
  const amt = parseFloat(state.adjAmount || '0') * 100 || 0;
  const isDebit = state.adjDir === 'debit';

  return (
    <ModalShell title="Manual adjustment" onClose={onClose}>
      <p style={{ fontSize: 13, color: '#687184', margin: '2px 0 20px' }}>
        Apply a credit or debit to <strong>{client?.company}</strong>'s wallet
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {(['credit', 'debit'] as const).map(dir => (
          <button
            key={dir}
            style={{
              height: 42, border: `2px solid ${state.adjDir === dir ? '#1f6feb' : '#dcdfe6'}`,
              background: state.adjDir === dir ? '#eaf1fe' : '#fff',
              color: state.adjDir === dir ? '#1f6feb' : '#3f4654',
              borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' as const,
            }}
          >{dir}</button>
        ))}
      </div>

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Amount (₹)</label>
      <input
        type="number"
        value={state.adjAmount}
        readOnly
        placeholder="0"
        style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 17, fontWeight: 700, fontFamily: "'IBM Plex Mono'", marginBottom: 14, boxSizing: 'border-box' }}
      />

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Reason</label>
      <textarea
        value={state.adjReason}
        readOnly
        placeholder="Explain the reason for this adjustment"
        style={{ width: '100%', height: 78, border: '1px solid #dcdfe6', borderRadius: 10, padding: '10px 13px', fontSize: 13.5, resize: 'none', marginBottom: 18, fontFamily: "'IBM Plex Sans'", boxSizing: 'border-box' }}
      />

      <div style={{ background: '#f5f9ff', border: '1px solid #d8e6fd', borderRadius: 10, padding: '12px 14px', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <MRow label="Current balance">{money(bal, false)}</MRow>
        <MRow label="Adjustment">{isDebit ? '-' : '+'}{money(amt, false)}</MRow>
        <div style={{ borderTop: '1px solid #d8e6fd', margin: '4px 0' }} />
        <MRow label="New balance"><span style={{ color: '#1f6feb' }}>{money(isDebit ? bal - amt : bal + amt, false)}</span></MRow>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, height: 42, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
        <button onClick={onSubmit} style={{ flex: 2, height: 42, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Apply adjustment</button>
      </div>
    </ModalShell>
  );
}

// Reject modal
export function RejectModal({ state, onClose, onSubmit }: BaseProps & { onSubmit: () => void }) {
  const d = state.modalData;

  return (
    <ModalShell title="Reject usage event" onClose={onClose}>
      <p style={{ fontSize: 13, color: '#687184', margin: '2px 0 16px' }}>
        Rejecting will move this event to the rejected queue and notify the staff member.
      </p>

      <div style={{ background: '#f8f9fb', borderRadius: 10, padding: '12px 14px', marginBottom: 18 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>{d?.desc}</div>
        <div style={{ fontSize: 12.5, color: '#687184' }}>by {d?.staff} · {d?.amountFmt}</div>
      </div>

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Reason for rejection</label>
      <textarea
        value={state.rejectReason}
        readOnly
        placeholder="Explain why this event is being rejected"
        style={{ width: '100%', height: 88, border: '1px solid #dcdfe6', borderRadius: 10, padding: '10px 13px', fontSize: 13.5, resize: 'none', marginBottom: 20, fontFamily: "'IBM Plex Sans'", boxSizing: 'border-box' }}
      />

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, height: 42, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
        <button onClick={onSubmit} style={{ flex: 2, height: 42, background: '#c5362c', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Confirm rejection</button>
      </div>
    </ModalShell>
  );
}

// Add user modal
export function AddUserModal({ onClose, onSubmit }: Omit<BaseProps, 'state'> & { onSubmit: () => void }) {
  return (
    <ModalShell title="Invite user" onClose={onClose}>
      <p style={{ fontSize: 13, color: '#687184', margin: '2px 0 20px' }}>
        An email invite will be sent to join your Khatova workspace.
      </p>

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Full name</label>
      <input
        placeholder="e.g. Priya Sharma"
        style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 13.5, marginBottom: 14, boxSizing: 'border-box' }}
      />

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 6 }}>Work email</label>
      <input
        type="email"
        placeholder="name@company.in"
        style={{ width: '100%', height: 44, border: '1px solid #dcdfe6', borderRadius: 10, padding: '0 13px', fontSize: 13.5, marginBottom: 14, boxSizing: 'border-box' }}
      />

      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#3f4654', marginBottom: 8 }}>Role</label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 22 }}>
        {[
          { role: 'ADMIN', label: 'Admin', desc: 'Full access' },
          { role: 'STAFF', label: 'Staff', desc: 'Log usage' },
          { role: 'CLIENT', label: 'Client', desc: 'View wallet' },
        ].map(r => (
          <button key={r.role} style={{ padding: '10px 8px', border: r.role === 'STAFF' ? '2px solid #1f6feb' : '1px solid #dcdfe6', background: r.role === 'STAFF' ? '#eaf1fe' : '#fff', borderRadius: 10, cursor: 'pointer', textAlign: 'center' as const }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: r.role === 'STAFF' ? '#1f6feb' : '#161b26' }}>{r.label}</div>
            <div style={{ fontSize: 11.5, color: '#9aa1ad', marginTop: 2 }}>{r.desc}</div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, height: 42, border: '1px solid #dcdfe6', background: '#fff', color: '#3f4654', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
        <button onClick={onSubmit} style={{ flex: 2, height: 42, background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Send invite</button>
      </div>
    </ModalShell>
  );
}
