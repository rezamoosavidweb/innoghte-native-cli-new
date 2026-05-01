import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

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
        glyph: { fontSize: 48, marginBottom: spacing.md },
        title: {
          fontSize: fontSize.lg,
          fontWeight: fontWeight.bold,
          color: colors.text,
          textAlign: 'center',
        },
        btn: {
          marginTop: spacing.xl,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing['2xl'],
          borderRadius: radius.md,
          backgroundColor: colors.primary,
        },
        btnText: { color: colors.onPrimary, fontWeight: fontWeight.semibold },
      }),
    [colors.onPrimary, colors.primary, colors.text],
  );
}
