import { colors } from '@/shared/styles/theme/core/colors';
import { radius } from '@/shared/styles/theme/core/radius';
import { spacing } from '@/shared/styles/theme/core/spacing';
import { fontSize, fontWeight, lineHeight } from '@/shared/styles/theme/core/typography';

/**
 * Stable object reference for context / imports — safe to reuse across renders.
 */
export const designTokens = {
  colors,
  /** @deprecated Prefer `colors`; kept for older call sites. */
  palette: colors,
  radius,
  spacing,
  fontSize,
  fontWeight,
  lineHeight,
} as const;

export type DesignTokens = typeof designTokens;
