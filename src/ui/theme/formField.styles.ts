import type { Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { radius } from '@/ui/theme/core/radius';
import { spacing } from '@/ui/theme/core/spacing';
import { fontSize, lineHeight } from '@/ui/theme/core/typography';

/**
 * Reusable form control styles (shared by {@link @/ui/components/form/InputField} and domain login screens).
 */
export function useFormFieldStyles(themeColors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        input: {
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: radius.lg - 2,
          paddingHorizontal: 14,
          paddingVertical: spacing.md,
          fontSize: fontSize.base,
          borderColor: themeColors.border,
          color: themeColors.text,
          backgroundColor: themeColors.card,
        },
        errorText: {
          color: '#d9534f',
          fontSize: fontSize.sm,
          lineHeight: lineHeight.normal,
        },
      }),
    [themeColors.border, themeColors.card, themeColors.text],
  );
}
