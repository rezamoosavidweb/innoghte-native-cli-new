import { colors } from '@/ui/theme/core/colors';
import { radius } from '@/ui/theme/core/radius';
import { spacing } from '@/ui/theme/core/spacing';
import { fontSize, fontWeight, lineHeight } from '@/ui/theme/core/typography';

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
