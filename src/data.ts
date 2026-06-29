import type { ContractType, ContractRateConfig, Currency } from './types';

export type { ContractRateConfig };

export const CURRENCIES: Record<Currency, { symbol: string; locale: string; label: string; option: string }> = {
  INR: { symbol: '₹', locale: 'en-IN', label: 'Indian Rupee', option: 'INR · ₹ Indian Rupee' },
  USD: { symbol: '$', locale: 'en-US', label: 'US Dollar', option: 'USD · $ US Dollar' },
  AED: { symbol: 'AED ', locale: 'en-AE', label: 'UAE Dirham', option: 'AED · Dubai (UAE Dirham)' },
  GBP: { symbol: '£', locale: 'en-GB', label: 'British Pound', option: 'GBP · UK (British Pound)' },
};

export function currencyMeta(c: Currency) {
  return CURRENCIES[c] || CURRENCIES.INR;
}

export function getUnitOptions(rate: ContractRateConfig | undefined) {
  if (!rate) return [] as Array<{ key: string; label: string; rate: number; amount: number; isMilestone: boolean }>;
  if (rate.kind === 'milestones')
    return (rate.rows || []).map(x => ({ key: x.key, label: x.label, amount: x.amount, isMilestone: true, rate: 0 }));
  if (rate.kind === 'sub')
    return [{ key: rate.rows?.[0]?.key || 'retainer', label: rate.rows?.[0]?.label || 'Retainer', rate: rate.amount || 0, isMilestone: false, amount: 0 }];
  return (rate.rows || []).map(x => ({ key: x.key, label: x.label, rate: x.amount, isMilestone: false, amount: 0 }));
}

// Formatters --------------------------------------------------------------
export function money(minor: number, decimals = false, currency: Currency = 'INR'): string {
  const c = currencyMeta(currency);
  const v = Math.abs(minor) / 100;
  return c.symbol + new Intl.NumberFormat(c.locale, {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(v);
}

export function initials(name: string): string {
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export function typeChip(t: ContractType) {
  const m: Record<ContractType, { label: string; bg: string; fg: string }> = {
    HOURLY: { label: 'Hourly', bg: '#eaf1fe', fg: '#1f6feb' },
    MILESTONE: { label: 'Milestone', bg: '#efecfb', fg: '#6b4ee0' },
    SUBSCRIPTION: { label: 'Subscription', bg: '#e0f2f0', fg: '#0c7a72' },
    METERED: { label: 'Metered', bg: '#fbf0d9', fg: '#8a5d08' },
  };
  return m[t];
}

export function walletStatus(balance: number, threshold: number) {
  if (balance < 0) return { label: 'Negative', bg: '#fbe9e7', fg: '#b5362b', key: 'NEGATIVE' as const };
  if (balance <= threshold) return { label: 'Low balance', bg: '#fbf0d9', fg: '#8a5d08', key: 'LOW' as const };
  return { label: 'Healthy', bg: '#e3f3ec', fg: '#0c6b4a', key: 'HEALTHY' as const };
}

export function evStatusChip(s: string) {
  const m: Record<string, { label: string; bg: string; fg: string }> = {
    PENDING: { label: 'Pending', bg: '#fbf0d9', fg: '#8a5d08' },
    BILLED: { label: 'Billed', bg: '#e3f3ec', fg: '#0c6b4a' },
    REJECTED: { label: 'Rejected', bg: '#eef0f3', fg: '#7a8190' },
  };
  return m[s] || m.PENDING;
}

export function qtyLabel(ev: { type: ContractType; qty: number }): string {
  if (ev.type === 'HOURLY') return `${ev.qty} hrs`;
  if (ev.type === 'MILESTONE') return '1 milestone';
  return `${ev.qty} units`;
}

export function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}
