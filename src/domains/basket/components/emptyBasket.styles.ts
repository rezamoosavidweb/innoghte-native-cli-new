import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontWeight, radius, spacing } from '@/ui/theme';

export function useEmptyBasketStyles(colors: ThemeColors) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          flex: 1,
          minHeight: 280,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.xl,
        },
        glyph: { marginBottom: spacing.lg, color: colors.error },
        title: {
          color: colors.error,
          textAlign: 'center',
        },
        btn: {
          marginTop: spacing['5xl'],
          borderRadius: radius.md,
        },
        btnText: { color: colors.onPrimary, fontWeight: fontWeight.semibold },
      }),
    [colors.onPrimary, colors.error],
  );
}
