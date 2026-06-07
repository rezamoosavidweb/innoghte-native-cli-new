/**
 * Insert thousands separators (commas) into the integer part of a numeric
 * string, preserving any decimal part and a trailing dot while typing.
 * Display-only — keep the raw (unseparated) value for API payloads.
 *
 * "50000" → "50,000" · "25.00" → "25.00" · "1000.5" → "1,000.5" · "25." → "25."
 */
export function groupThousands(value: string): string {
  if (!value) return '';
  const negative = value.startsWith('-');
  const unsigned = negative ? value.slice(1) : value;
  const dotIndex = unsigned.indexOf('.');
  const intPart = dotIndex === -1 ? unsigned : unsigned.slice(0, dotIndex);
  const decPart = dotIndex === -1 ? '' : unsigned.slice(dotIndex);
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${negative ? '-' : ''}${grouped}${decPart}`;
}
