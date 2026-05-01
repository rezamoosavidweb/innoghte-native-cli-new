import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import {
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '@/ui/theme';

export function useSelectPaymentTypeStyles(colors: ThemeColors) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          gap: spacing.md,
          marginBottom: spacing.md,
        },
        chip: {
          flex: 1,
          paddingVertical: spacing.lg,
          borderRadius: radius.md,
          borderWidth: 2,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.surface,
        },
        chipOn: { borderColor: colors.textSecondary },
        chipMuted: { opacity: 0.45 },
        lbl: {
          fontSize: fontSize.sm,
          fontWeight: fontWeight.medium,
          color: colors.text,
        },
      }),
    [colors.border, colors.surface, colors.text, colors.textSecondary],
  );
}
