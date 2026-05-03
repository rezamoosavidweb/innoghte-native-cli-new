import { StyleSheet } from 'react-native';

import { radius } from '@/ui/theme/core/radius';
import { fontSize, lineHeight } from '@/ui/theme/core/typography';
import type { ThemeColors } from '@/ui/theme/types';

/**
 * Reusable form control styles (shared by {@link @/ui/components/form/InputField} and domain login screens).
 *
 * Accepts the semantic {@link ThemeColors} so the input field background can
 * resolve to the right token (`inputBackground` — diverges between schemes
 * per the theme spec).
 */
export function createFormFieldStyles(themeColors: ThemeColors) {
  return StyleSheet.create({
    input: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.lg - 2,
      minHeight: 48,
      paddingHorizontal: 14,
      fontSize: fontSize.base,
      borderColor: themeColors.border,
      color: themeColors.text,
      backgroundColor: themeColors.inputBackground,
    },
    errorText: {
      color: themeColors.errorText,
      fontSize: fontSize.sm,
      lineHeight: lineHeight.normal,
    },
  });
}
