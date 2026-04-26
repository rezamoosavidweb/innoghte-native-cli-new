/** Spacing scale (padding / margin / gap), migrated from legacy `SPACING`. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 22,
  '3xl': 24,
  '4xl': 26,
  '5xl': 28,
  '6xl': 30,
  '7xl': 32,
  '8xl': 34,
  '9xl': 36,
  '10xl': 40,
} as const;

export type SpacingToken = keyof typeof spacing;
