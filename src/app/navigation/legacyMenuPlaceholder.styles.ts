import type { Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { fontSize, fontWeight, lineHeight, spacing } from '@/ui/theme';

export function useLegacyMenuPlaceholderStyles(themeColors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          padding: spacing['3xl'],
          gap: spacing.md,
          backgroundColor: themeColors.background,
        },
        title: {
          fontSize: fontSize.xl,
          fontWeight: fontWeight.bold,
          color: themeColors.text,
        },
        body: {
          fontSize: fontSize.md + 1,
          lineHeight: lineHeight.normal,
          opacity: 0.85,
          color: themeColors.text,
        },
      }),
    [themeColors.background, themeColors.text],
  );
}
