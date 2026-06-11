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
      return { backgroundColor: colors.successMuted, color: colors.successText };
    case 'warning':
      return { backgroundColor: colors.warningBg, color: colors.warningText };
    case 'danger':
      return { backgroundColor: colors.errorMuted, color: colors.errorText };
    case 'info':
      return { backgroundColor: colors.infoBg, color: colors.infoText };
    default:
      return {
        backgroundColor: colors.border,
        color: colors.text,
      };
  }
}
