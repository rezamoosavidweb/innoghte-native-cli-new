export { default as isCreditCard, formatCardNumber } from '@/shared/utils/paymentFormatting';

const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** Convert ASCII digits in a string to Persian numerals (web `toPersianNumber` behavior). */
export function toPersianNumber(value: string): string {
  return value.replace(/\d/g, d => persianDigits[Number(d)] ?? d);
}
