const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** ASCII → Persian digits in a string (matches client-web `toPersianNumber`). */
export function toPersianNumber(value: string): string {
  return value.replace(/\d/g, d => persianDigits[Number(d)] ?? d);
}
