/**
 * Picks status bar icon style from a solid background so contrast stays
 * readable (WCAG-style relative luminance).
 */
function parseHexRgb(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.trim().replace(/^#/, '');
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map(c => c + c)
          .join('')
      : raw;
  if (!/^[0-9a-f]{6}$/i.test(full)) {
    return null;
  }
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  return { r, g, b };
}

function channelToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.0392901 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(r: number, g: number, b: number): number {
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

/**
 * @param backgroundColor Solid fill behind the status bar (typically `#RRGGBB`).
 * @returns `light-content` for dark backgrounds (light icons), `dark-content` for light fills.
 */
export function inferStatusBarContentStyle(
  backgroundColor: string,
): 'light-content' | 'dark-content' {
  const rgb = parseHexRgb(backgroundColor);
  if (!rgb) {
    return 'dark-content';
  }
  return relativeLuminance(rgb.r, rgb.g, rgb.b) > 0.179
    ? 'dark-content'
    : 'light-content';
}
