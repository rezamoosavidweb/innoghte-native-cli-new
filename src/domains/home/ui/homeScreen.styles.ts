import type { Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { spacing } from '@/ui/theme';

export function useHomeScreenStyles(themeColors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        safe: {
          flex: 1,
          backgroundColor: themeColors.background,
        },
        scroll: {
          flex: 1,
        },
        content: {
          paddingBottom: spacing['7xl'],
          gap: spacing.md,
        },
      }),
    [themeColors.background],
  );
}
