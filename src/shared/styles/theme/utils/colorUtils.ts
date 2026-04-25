/**
 * Build `rgba(...)` from `#RRGGBB` / `#RGB`. Alpha in 0–1.
 * Keeps semantic tokens free of hand-written rgba tuples.
 */
export function hexAlpha(hex: string, alpha: number): string {
  const raw = hex.trim().replace('#', '');
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map(c => c + c)
          .join('')
      : raw;
  if (full.length !== 6) {
    return `rgba(0,0,0,${alpha})`;
  }
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
