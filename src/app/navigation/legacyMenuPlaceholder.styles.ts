import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import { fontSize, fontWeight, lineHeight, spacing } from '@/ui/theme';

export function createLegacyMenuPlaceholderStyles(
  themeColors: Theme['colors'],
) {
  return StyleSheet.create({
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
  });
}
