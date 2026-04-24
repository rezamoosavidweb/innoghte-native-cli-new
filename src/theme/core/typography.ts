/**
 * Typography tokens. Legacy app used a custom face (`On Regular`); wire
 * `fontFamily` in your root text style or per-screen when fonts are linked.
 */
export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 22,
  '3xl': 24,
  '4xl': 30,
} as const;

export const fontWeight = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '900' as const,
};

export const lineHeight = {
  tight: 16,
  snug: 20,
  normal: 22,
  relaxed: 24,
} as const;

/** Optional display font once loaded via `react-native` asset linking. */
export const fontFamily = {
  /** Legacy primary face name from the old app. */
  text: undefined as string | undefined,
} as const;
