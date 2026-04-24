/** Border radii, migrated from legacy `BORDER_RADIUS`. */
export const radius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  /** Category chips, horizontal pills (~20px). */
  pill: 20,
  '2xl': 20,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
