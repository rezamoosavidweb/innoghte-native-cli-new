import type { Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

/** Layout-only FAQ screen regions (no theme colors). */
export function useFaqsScreenLayoutStyles() {
  return React.useMemo(
    () =>
      StyleSheet.create({
        faqsRootPad: { paddingTop: spacing.md },
        chipsRow: {
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.md,
          gap: spacing.sm,
          flexDirection: 'row',
          alignItems: 'center',
        },
        listPad: {
          paddingHorizontal: spacing.base,
          paddingBottom: spacing['3xl'],
        },
      }),
    [],
  );
}

export function useFaqsCategoryChipStyles(
  themeColors: Theme['colors'],
  active: boolean,
) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        press: {
          paddingVertical: spacing.sm,
          paddingHorizontal: 14,
          borderRadius: radius.pill,
          borderWidth: StyleSheet.hairlineWidth,
          overflow: 'hidden',
          borderColor: active ? themeColors.primary : themeColors.border,
          backgroundColor: themeColors.card,
        },
        pressDim: { opacity: 0.85 },
        label: {
          fontSize: fontSize.md,
          fontWeight: fontWeight.semibold,
          color: active ? themeColors.primary : themeColors.text,
        },
      }),
    [
      active,
      themeColors.border,
      themeColors.card,
      themeColors.primary,
      themeColors.text,
    ],
  );
}

export function useFaqsSearchInputStyles(themeColors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        input: {
          marginHorizontal: spacing.base,
          marginBottom: spacing.md - 2,
          borderRadius: radius.lg - 2,
          borderWidth: StyleSheet.hairlineWidth,
          paddingHorizontal: 14,
          paddingVertical: spacing.md - 2,
          fontSize: fontSize.base,
          borderColor: themeColors.border,
          color: themeColors.text,
          backgroundColor: themeColors.card,
        },
      }),
    [themeColors.border, themeColors.card, themeColors.text],
  );
}
