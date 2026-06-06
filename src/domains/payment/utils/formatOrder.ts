import { isDotIr } from '@/shared/config/resolveIsDotIr';
import type { PaymentGatewayName } from '@/shared/contracts/navigationPayment';

const LANG = isDotIr ? 'fa-IR' : 'en-US';

const FA_MONTHS = [
  'ژانویه',
  'فوریه',
  'مارس',
  'آوریل',
  'مه',
  'ژوئن',
  'ژوئیه',
  'آگوست',
  'سپتامبر',
  'اکتبر',
  'نوامبر',
  'دسامبر',
] as const;

/**
 * Order prices arrive in Rial; `.ir` displays Toman (÷10). `.com` shows USD.
 * Mirrors client-web `SuccessOrder.formatPrice`.
 */
export function formatOrderPrice(value: number): string {
  if (!value) return 'رایگان';
  if (isDotIr) {
    const toman = value / 10;
    try {
      return `${new Intl.NumberFormat(LANG).format(toman)} تومان`;
    } catch {
      return `${toman} تومان`;
    }
  }
  return `$${value}`;
}

/** Persian long-date for `.ir`; Gregorian month name (Persian) otherwise. */
export function formatPaidAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  if (isDotIr) {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch {
      return iso;
    }
  }
  const month = FA_MONTHS[date.getUTCMonth()] ?? '';
  return `${month} ${date.getUTCDate()}، ${date.getUTCFullYear()}`;
}

const GATEWAY_LABEL: Record<PaymentGatewayName, string> = {
  zarinpal: 'پرداخت امن زرین‌پال',
  vandar: 'پرداخت امن وندار',
  paypal: 'PayPal',
};

/** Payment-method label for the order summary. */
export function paymentMethodLabel(
  gatewayName: PaymentGatewayName,
  totalPayable: string | number | null | undefined,
): string {
  if (totalPayable === '0' || totalPayable === 0 || totalPayable == null) {
    return 'رایگان';
  }
  return GATEWAY_LABEL[gatewayName] ?? 'پرداخت امن';
}
