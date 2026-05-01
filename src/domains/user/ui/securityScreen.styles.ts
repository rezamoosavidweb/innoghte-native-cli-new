import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { spacing } from '@/ui/theme/core/spacing';
import { fontSize } from '@/ui/theme/core/typography';

export type SecurityScreenStyles = ReturnType<typeof createSecurityScreenStyles>;

export function createSecurityScreenStyles(
  navColors: Theme['colors'],
  ui: ThemeColors,
) {
  return StyleSheet.create({
    sectionHeading: {
      fontSize: fontSize.lg,
      fontWeight: '700',
      color: navColors.text,
      marginBottom: spacing.md,
    },
    sectionHeadingSpaced: {
      fontSize: fontSize.lg,
      fontWeight: '700',
      color: navColors.text,
      marginTop: spacing.xl,
      marginBottom: spacing.md,
    },
    devicesMuted: { color: ui.textMuted },
    devicesError: { color: ui.errorText },
    passwordSummaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
      paddingVertical: spacing.md,
    },
    passwordSummaryTextBlock: { flex: 1 },
    passwordSummaryLabel: {
      color: ui.textMuted,
      fontWeight: '600',
    },
    passwordMasked: { color: navColors.text, marginTop: spacing.xs },
    changePasswordBtn: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: navColors.border,
    },
    changePasswordBtnPressed: { opacity: 0.85 },
    changePasswordLabel: { color: navColors.primary, fontWeight: '700' },
    formStack: { gap: spacing.md },
    fieldStack: { gap: spacing.xs },
    fieldLabel: { color: navColors.text, fontWeight: '600' },
    hintMuted: { color: ui.textMuted },
    forgetPasswordText: { color: navColors.primary, fontWeight: '700' },
    buttonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    successText: { color: ui.successText },
    apiErrorMargin: { marginTop: spacing.sm },
  });
}
