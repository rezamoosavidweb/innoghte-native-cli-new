import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontSize, fontWeight, spacing } from '@/ui/theme';

export function useCartHeaderStyles(colors: ThemeColors) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        wrap: { marginBottom: spacing.md },
        title: {
          fontSize: fontSize.lg + 2,
          fontWeight: fontWeight.semibold,
          color: colors.text,
        },
        sub: {
          marginTop: spacing.xs,
          fontSize: fontSize.sm,
          color: colors.textSecondary,
        },
      }),
    [colors.text, colors.textSecondary],
  );
}
