import * as React from 'react';
import { StyleSheet } from 'react-native';

import {
  fontSize,
  fontWeight,
  radius,
  spacing,
  type ThemeColors,
  useThemeColors,
} from '@/ui/theme';

function createBreathingScreenStyles(themeColors: ThemeColors) {
  return StyleSheet.create({
    column: {
      flex: 1,
      width: '100%',
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl,
      paddingBottom: spacing['4xl'],
    },
    fillCenter: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.lg,
    },
    phaseTitle: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.bold,
      textAlign: 'center',
      color: themeColors.text,
    },
    sessionRow: {
      fontSize: fontSize.md + 1,
      fontWeight: fontWeight.medium,
      textAlign: 'center',
      color: themeColors.textSecondary,
    },
    primaryCta: {
      width: '100%',
      maxWidth: 320,
      alignSelf: 'center',
      paddingVertical: spacing.base + 2,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.lg,
      backgroundColor: themeColors.primary,
      alignItems: 'center',
    },
    primaryCtaPressed: {
      opacity: 0.88,
    },
    primaryCtaLabel: {
      fontSize: fontSize.md + 2,
      fontWeight: fontWeight.semibold,
      color: themeColors.onPrimary,
    },
  });
}

export function useBreathingScreenStyles() {
  const themeColors = useThemeColors();
  return React.useMemo(
    () => createBreathingScreenStyles(themeColors),
    [themeColors],
  );
}
