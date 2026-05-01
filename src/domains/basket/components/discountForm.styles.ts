import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

export function useDiscountFormStyles(colors: ThemeColors) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        wrap: { marginBottom: spacing.lg },
        label: {
          fontWeight: fontWeight.medium,
          marginBottom: spacing.sm,
          color: colors.text,
          fontSize: fontSize.sm + 1,
        },
        fieldRow: {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: radius.lg,
          backgroundColor: colors.surfaceSecondary,
          paddingLeft: spacing.md,
          paddingRight: spacing.xs,
          minHeight: 48,
        },
        input: {
          flex: 1,
          color: colors.text,
          fontSize: fontSize.base,
          paddingVertical: spacing.sm,
        },
        addBtn: {
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.text,
        },
        addBtnDisabled: { opacity: 0.45 },
        addLbl: {
          color: colors.background,
          fontSize: fontSize.xl,
          fontWeight: fontWeight.bold,
        },
      }),
    [
      colors.background,
      colors.surfaceSecondary,
      colors.text,
    ],
  );
}
