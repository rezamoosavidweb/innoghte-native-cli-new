import type { ThemeColors } from '@/ui/theme';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'muted';

export function getOrderStatusPresentation(
  status: string | undefined,
): { label: string; tone: StatusTone } {
  switch (status) {
    case 'active':
      return { label: 'موفق', tone: 'success' };
    case 'pending':
      return { label: 'در حال بررسی', tone: 'warning' };
    case 'refund':
      return { label: 'بازپس‌داده‌شده', tone: 'info' };
    case 'canceled':
      return { label: 'لغوشده', tone: 'danger' };
    default:
      return { label: 'نامشخص', tone: 'muted' };
  }
}

export function getPaymentStatusPresentation(
  status: string | undefined,
): { label: string; tone: StatusTone } {
  switch (status) {
    case 'completed':
      return { label: 'موفق', tone: 'success' };
    case 'uncompleted':
      return { label: 'ناموفق', tone: 'danger' };
    case 'canceled':
      return { label: 'لغوشده', tone: 'danger' };
    case 'unknown':
      return { label: 'نامشخص', tone: 'muted' };
    default:
      return { label: 'نامشخص', tone: 'muted' };
  }
}

/** Badge backgrounds / text — tuned for dark surfaces (matches web table chips). */
export function toneColors(
  tone: StatusTone,
  colors: ThemeColors,
): { backgroundColor: string; color: string } {
  switch (tone) {
    case 'success':
      return { backgroundColor: '#0E2A2C', color: '#4ADE80' };
    case 'warning':
      return { backgroundColor: '#272A24', color: '#CA8A04' };
    case 'danger':
      return { backgroundColor: '#302024', color: '#F87171' };
    case 'info':
      return { backgroundColor: '#1E293B', color: '#60A5FA' };
    default:
      return {
        backgroundColor: colors.border,
        color: colors.text,
      };
  }
}
