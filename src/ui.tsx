// Shared UI primitives
import type { CSSProperties, ReactNode } from 'react';

interface IconProps { name: string; size?: number; color?: string; style?: CSSProperties; }
export function Icon({ name, size = 20, color, style }: IconProps) {
  return (
    <span
      style={{
        fontFamily: "'Material Symbols Outlined'",
        fontSize: size,
        lineHeight: 1,
        color,
        userSelect: 'none',
        ...style,
      }}
    >
      {name}
    </span>
  );
}

interface BadgeProps { label: string; bg: string; fg: string; style?: CSSProperties; }
export function Badge({ label, bg, fg, style }: BadgeProps) {
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 11.5,
      fontWeight: 600,
      padding: '3px 9px',
      borderRadius: 20,
      background: bg,
      color: fg,
      ...style,
    }}>
      {label}
    </span>
  );
}

interface TypeBadgeProps { label: string; bg: string; fg: string; }
export function TypeBadge({ label, bg, fg }: TypeBadgeProps) {
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: 6,
      background: bg,
      color: fg,
    }}>
      {label}
    </span>
  );
}

interface CardProps { children: ReactNode; style?: CSSProperties; className?: string; }
export function Card({ children, style, className }: CardProps) {
  return (
    <div className={className} style={{
      background: '#fff',
      border: '1px solid #e7e9ee',
      borderRadius: 14,
      boxShadow: '0 1px 2px rgba(16,24,40,.03)',
      ...style,
    }}>
      {children}
    </div>
  );
}

interface BtnProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  style?: CSSProperties;
  type?: 'button' | 'submit';
}
export function Btn({ children, onClick, variant = 'secondary', style, type = 'button' }: BtnProps) {
  const base: CSSProperties = {
    height: 40,
    border: 'none',
    borderRadius: 9,
    padding: '0 16px',
    fontSize: 13.5,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    transition: 'background 0.12s',
  };
  const variants: Record<string, CSSProperties> = {
    primary: { background: '#1f6feb', color: '#fff', boxShadow: '0 2px 8px rgba(31,111,235,.22)' },
    secondary: { background: '#fff', color: '#3f4654', border: '1px solid #dcdfe6' },
    danger: { background: '#c5362c', color: '#fff' },
    ghost: { background: 'transparent', color: '#687184', border: '1px solid #dcdfe6' },
  };
  return (
    <button type={type} onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

interface AvatarProps { text: string; bg?: string; fg?: string; size?: number; radius?: number; }
export function Avatar({ text, bg = '#eef1f6', fg = '#54607a', size = 36, radius }: AvatarProps) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: radius ?? size / 2,
      background: bg,
      color: fg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.35,
      fontWeight: 600,
      flexShrink: 0,
    }}>
      {text}
    </div>
  );
}

interface InputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  style?: CSSProperties;
}
export function Input({ value, onChange, placeholder, type = 'text', style }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        height: 44,
        border: '1px solid #dcdfe6',
        borderRadius: 10,
        padding: '0 13px',
        fontSize: 14,
        color: '#161b26',
        background: '#fff',
        ...style,
      }}
      onFocus={e => { e.currentTarget.style.borderColor = '#1f6feb'; e.currentTarget.style.boxShadow = '0 0 0 3px #eaf1fe'; }}
      onBlur={e => { e.currentTarget.style.borderColor = '#dcdfe6'; e.currentTarget.style.boxShadow = 'none'; }}
    />
  );
}

interface TableHeaderProps { cols: string[]; style?: CSSProperties; }
export function TableHeader({ cols, style }: TableHeaderProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: style?.gridTemplateColumns as string,
      padding: '11px 20px',
      borderBottom: '1px solid #eef0f3',
      fontSize: 11.5,
      fontWeight: 600,
      color: '#9aa1ad',
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
      ...style,
    }}>
      {cols.map((c, i) => <div key={i}>{c}</div>)}
    </div>
  );
}
