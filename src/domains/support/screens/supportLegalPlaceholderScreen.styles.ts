import type { Theme as NavigationTheme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontSize, fontWeight } from '@/ui/theme';

export function useSupportLegalPlaceholderScreenStyles(
  colors: NavigationTheme['colors'],
  semantic: ThemeColors,
) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        title: {
          color: colors.text,
          fontSize: fontSize.lg,
          fontWeight: fontWeight.semibold,
          marginBottom: 8,
        },
        body: {
          color: semantic.textMuted,
          lineHeight: fontSize.base * 1.45,
          fontSize: fontSize.base,
        },
      }),
    [colors.text, semantic.textMuted],
  );
}
