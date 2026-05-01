import type { Theme as NavigationTheme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { radius } from '@/ui/theme/core/radius';
import { spacing } from '@/ui/theme/core/spacing';
import { fontSize, fontWeight } from '@/ui/theme/core/typography';

export function useErrorStateButtonStyles(
  navigationColors: NavigationTheme['colors'],
  themeColors: ThemeColors,
) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        retryPressable: {
          marginTop: spacing.lg,
          paddingVertical: spacing.sm + 2,
          paddingHorizontal: spacing['2xl'],
          borderRadius: radius.md,
          backgroundColor: navigationColors.primary,
        },
        retryLabel: {
          fontSize: fontSize.sm + 1,
          fontWeight: fontWeight.semibold,
          color: themeColors.onPrimary,
        },
      }),
    [navigationColors.primary, themeColors.onPrimary],
  );
}
