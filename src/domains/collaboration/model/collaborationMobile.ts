import { isDotIr } from '@/shared/config/resolveIsDotIr';

/**
 * Normalize a free-text mobile into E.164 (`+<country><national>`), matching the
 * format every InNoghte API requires (it rejects `00…`/national-only forms).
 * The collaboration field has no country picker, so the region dial code is
 * assumed from the build (`+98` for `.ir`, else `+1`). Tolerates inputs that
 * already include the country code, an international `00` prefix, or a trunk `0`.
 */
export function collaborationApiMobile(raw: string): string {
  const cc = isDotIr ? '98' : '1';
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }
  if (digits.startsWith(cc)) {
    digits = digits.slice(cc.length);
  }
  digits = digits.replace(/^0+/, '');
  return `+${cc}${digits}`;
}
