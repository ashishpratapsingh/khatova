import type { ReactNode } from 'react';
import { Icon } from '../ui';

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}

export function ModalShell({ title, onClose, children, width = '440px' }: Props) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(14,20,30,.42)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        animation: 'lgFade .15s ease',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: width,
          maxHeight: 'calc(100vh - 48px)',
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 24px 60px rgba(16,24,40,.28)',
          animation: 'lgPop .2s cubic-bezier(.2,.8,.2,1)',
          overflow: 'auto',
        }}
      >
        <div style={{ padding: '22px 24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.3px' }}>{title}</div>
            <span onClick={onClose} style={{ cursor: 'pointer' }}>
              <Icon name="close" size={22} color="#9aa1ad" />
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// Row helper
export function MRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
      <span style={{ color: '#687184' }}>{label}</span>
      <span style={{ fontFamily: "'IBM Plex Mono'", fontWeight: 500 }}>{children}</span>
    </div>
  );
}
