/**
 * Builds a fully transparent variant of a CSS-like color for interpolation start.
 * Supports `#rgb`, `#rrggbb`, and `rgb(...)` / `rgba(...)`.
 */
export function transparentVariant(color: string): string {
  const t = color.trim();
  const hex6 = /^#([0-9a-f]{6})$/i.exec(t);
  if (hex6) {
    return `#${hex6[1]}00`;
  }
  const hex3 = /^#([0-9a-f]{3})$/i.exec(t);
  if (hex3) {
    const [a, b, c] = hex3[1].split('');
    return `#${a}${a}${b}${b}${c}${c}00`;
  }
  const rgb = /^rgba?\(\s*([^)]+)\s*\)$/i.exec(t);
  if (rgb) {
    const parts = rgb[1].split(',').map((p) => p.trim());
    if (parts.length >= 3) {
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, 0)`;
    }
  }
  return 'rgba(0, 0, 0, 0)';
}

function parseRgbChannels(color: string): { r: number; g: number; b: number } | null {
  const t = color.trim();
  const hex6 = /^#([0-9a-f]{6})$/i.exec(t);
  if (hex6) {
    const n = parseInt(hex6[1], 16);
    const r = Math.floor(n / 65536) % 256;
    const g = Math.floor(n / 256) % 256;
    const b = n % 256;
    return { r, g, b };
  }
  const hex3 = /^#([0-9a-f]{3})$/i.exec(t);
  if (hex3) {
    const [a, b, c] = hex3[1].split('');
    return {
      r: parseInt(a + a, 16),
      g: parseInt(b + b, 16),
      b: parseInt(c + c, 16),
    };
  }
  const rgb = /^rgba?\(\s*([^)]+)\s*\)$/i.exec(t);
  if (rgb) {
    const parts = rgb[1].split(',').map((p) => p.trim());
    if (parts.length >= 3) {
      return {
        r: Number(parts[0]),
        g: Number(parts[1]),
        b: Number(parts[2]),
      };
    }
  }
  return null;
}

function linearize(u8: number): number {
  const c = u8 / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/**
 * Relative luminance (sRGB). Used to pick readable foreground on `backgroundColor`.
 */
export function relativeLuminance(color: string): number {
  const ch = parseRgbChannels(color);
  if (!ch) {
    return 0.5;
  }
  const R = linearize(ch.r);
  const G = linearize(ch.g);
  const B = linearize(ch.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastingForeground(background: string): '#000000' | '#FFFFFF' {
  return relativeLuminance(background) > 0.45 ? '#000000' : '#FFFFFF';
}
