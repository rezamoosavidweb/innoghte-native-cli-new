import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { createCardStyle } from '@/ui/theme/core/card.styles';
import { radius } from '@/ui/theme/core/radius';
import { spacing } from '@/ui/theme/core/spacing';
import { fontSize } from '@/ui/theme/core/typography';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

export type AccountScreenStyles = ReturnType<typeof createAccountScreenStyles>;

export function createAccountScreenStyles(
  navColors: Theme['colors'],
  ui: ThemeColors,
) {
  return StyleSheet.create({
    errorText: { color: ui.errorText },
    retryPressable: { marginTop: spacing.md },
    retryLabel: { color: navColors.primary },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 0,
      gap: spacing.md,
      paddingBottom: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: navColors.border,
    },
    card: createCardStyle(navColors, { gap: spacing.md, marginBottom: spacing.lg }),
    screenTitle: {
      fontSize: fontSize.lg,
      fontWeight: '700',
      color: navColors.text,
      flex: 1,
    },
    editBtn: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
      backgroundColor: hexAlpha(navColors.primary, 0.13),
    },
    editBtnPressed: { opacity: 0.85 },
    editLabel: { color: navColors.primary, fontWeight: '700' },
    rowBlock: {
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: hexAlpha(navColors.border, 0.75),
    },
    rowBlockLast: {
      paddingVertical: spacing.md,
      borderBottomWidth: 0,
    },
    rowLabelMuted: {
      color: ui.textMuted,
      fontWeight: '700',
      marginBottom: spacing.sm,
      fontSize: fontSize.base,
    },
    rowValue: {
      color: navColors.text,
      fontWeight: '600',
      fontSize: fontSize.base,
      writingDirection: 'ltr',
    },
    badgeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: spacing.sm,
    },
    badgeValue: {
      color: navColors.text,
      fontWeight: '600',
      fontSize: fontSize.base,
      flexShrink: 1,
    },
    badgePillVerified: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.sm,
      backgroundColor: hexAlpha(ui.successText, 0.13),
    },
    badgePillUnverified: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.sm,
      backgroundColor: hexAlpha(ui.errorText, 0.13),
    },
    badgeTextVerified: {
      color: ui.successText,
      fontSize: fontSize.sm,
      fontWeight: '700',
    },
    badgeTextUnverified: {
      color: ui.errorText,
      fontSize: fontSize.sm,
      fontWeight: '700',
    },
    verifyLink: { color: navColors.primary, fontWeight: '700' },
  });
}
