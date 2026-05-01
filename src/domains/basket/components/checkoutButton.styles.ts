import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

export function useCheckoutButtonStyles(colors: ThemeColors) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        btn: {
          marginTop: spacing.md,
          paddingVertical: spacing.md,
          borderRadius: radius.md,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 48,
        },
        disabled: { opacity: 0.5 },
        txt: {
          color: colors.onPrimary,
          fontWeight: fontWeight.semibold,
          fontSize: fontSize.base,
        },
      }),
    [colors.onPrimary, colors.primary],
  );
}
