import { formatNumberForLocale } from '@/shared/infra/i18n/formatLocaleNumbers';
import { toPersianNumber } from '@/shared/utils/toPersianNumber';

import type { OrderDto } from '@/domains/transactions/model/order.schemas';

function formatRefId(
  ref: string | number | null | undefined,
  language: string,
): string {
  if (ref == null || ref === '') {
    return '—';
  }
  const s = String(ref);
  return language === 'fa' ? toPersianNumber(s) : s;
}

export function formatOrderPayableLine(
  order: OrderDto,
  language: string,
): string {
  if (order.currency_type === 'IRR') {
    const tomans = Number(order.total_payable ?? 0) / 10;
    return `${formatNumberForLocale(tomans, language)} تومان`;
  }
  if (order.currency_type === 'USD') {
    return `$${toPersianNumber(String(order.total_payable ?? ''))}`;
  }
  return '—';
}

export function formatOrderMoneyField(
  order: OrderDto,
  raw: string,
  language: string,
): string {
  if (order.currency_type === 'IRR') {
    const tomans = Number(raw ?? 0) / 10;
    if (!Number.isFinite(tomans)) {
      return '—';
    }
    return `${formatNumberForLocale(tomans, language)} تومان`;
  }
  if (order.currency_type === 'USD') {
    return `$${toPersianNumber(String(raw ?? ''))}`;
  }
  return '—';
}

export function formatDiscountLine(
  order: OrderDto,
  language: string,
): string {
  const d = Number(order.discount_amount ?? 0);
  if (!Number.isFinite(d) || d === 0) {
    return '—';
  }
  return formatOrderMoneyField(order, String(order.discount_amount), language);
}

export function buildCourseSummary(order: OrderDto, maxLen = 80): string {
  const titles = order.courses
    .map(c => c.title_fa ?? '')
    .filter(Boolean)
    .join('، ');
  if (!titles) {
    return '—';
  }
  if (titles.length <= maxLen) {
    return titles;
  }
  return `${titles.slice(0, Math.max(0, maxLen - 1)).trim()}…`;
}

export function formatOrderDate(
  iso: string | undefined,
  language: string,
): string | undefined {
  if (!iso) {
    return undefined;
  }
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      return undefined;
    }
    return d.toLocaleString(language === 'fa' ? 'fa-IR' : undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return undefined;
  }
}

export function formatTrackingCode(
  order: OrderDto,
  language: string,
): string {
  return formatRefId(order.payment?.ref_id, language);
}
