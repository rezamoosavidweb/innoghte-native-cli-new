import type { Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { fontSize, fontWeight, lineHeight, radius, spacing } from '@/ui/theme';

export function useFaqExpandableRowStyles(themeColors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          borderRadius: radius.lg - 2,
          borderWidth: StyleSheet.hairlineWidth,
          overflow: 'hidden',
          borderColor: themeColors.border,
          backgroundColor: themeColors.card,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
          gap: spacing.md,
        },
        q: {
          fontSize: fontSize.md + 1,
          fontWeight: fontWeight.semibold,
          flex: 1,
          color: themeColors.text,
        },
        chev: {
          fontSize: fontSize.md,
          opacity: 0.6,
          color: themeColors.text,
        },
        a: {
          fontSize: fontSize.md,
          lineHeight: lineHeight.normal,
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.md,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: themeColors.border,
          paddingTop: spacing.md - 2,
          color: themeColors.text,
        },
      }),
    [themeColors.border, themeColors.card, themeColors.text],
  );
}
