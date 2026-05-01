import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

/** Layout-only FAQ screen regions (no theme colors). */
export function createFaqsScreenLayoutStyles() {
  return StyleSheet.create({
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
  });
}

export function createFaqsCategoryChipStyles(
  themeColors: Theme['colors'],
  active: boolean,
) {
  return StyleSheet.create({
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
  });
}

export function createFaqsSearchInputStyles(themeColors: Theme['colors']) {
  return StyleSheet.create({
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
  });
}
