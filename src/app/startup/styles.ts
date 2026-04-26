import type { Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { fontSize, fontWeight, lineHeight, spacing } from '@/ui/theme';

export function useStartupScreenStyles(themeColors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        safe: { flex: 1, backgroundColor: themeColors.background },
        scroll: { padding: spacing['3xl'], gap: 14 },
        title: {
          fontSize: fontSize['2xl'],
          fontWeight: fontWeight.bold,
          color: themeColors.text,
        },
        body: {
          fontSize: fontSize.md + 1,
          lineHeight: lineHeight.normal,
          opacity: 0.85,
          color: themeColors.text,
        },
        actions: { marginTop: spacing.xl, gap: spacing.md - 2 },
      }),
    [themeColors.background, themeColors.text],
  );
}
