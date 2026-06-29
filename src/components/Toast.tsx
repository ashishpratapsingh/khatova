import { Icon } from '../ui';

interface Props {
  msg: string;
  tone: 'ok' | 'warn';
}

export default function Toast({ msg, tone }: Props) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 60,
      animation: 'lgToast .25s cubic-bezier(.2,.8,.2,1)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        background: '#161b26',
        color: '#fff',
        padding: '12px 18px',
        borderRadius: 11,
        boxShadow: '0 12px 30px rgba(16,24,40,.35)',
      }}>
        <Icon name={tone === 'warn' ? 'error' : 'check_circle'} size={20} color={tone === 'warn' ? '#f0a23a' : '#4ade80'} />
        <span style={{ fontSize: 13.5, fontWeight: 500 }}>{msg}</span>
      </div>
    </div>
  );
}
