import { StyleSheet } from 'react-native';

import { radius } from '@/ui/theme/core/radius';
import { spacing } from '@/ui/theme/core/spacing';
import { FORM_CONTROL_HEIGHT } from '@/ui/theme/core/formControlHeight';
import { fontSize, fontWeight, lineHeight } from '@/ui/theme/core/typography';
import type { ThemeColors } from '@/ui/theme/types';

export function createPhoneInputStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: {
      width: '100%',
    },
    /** Keeps flag + dial + national digits left-to-right in RTL locales. */
    ltrRow: {
      direction: 'ltr',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'stretch',
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.lg - 2,
      borderColor: colors.border,
      backgroundColor: colors.inputBackground,
      overflow: 'hidden',
      height: FORM_CONTROL_HEIGHT,
    },
    rowError: {
      borderColor: colors.errorText,
    },
    rowValid: {
      borderColor: colors.success,
    },
    rowDisabled: {
      opacity: 0.55,
    },
    countrySide: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      gap: spacing.xs,
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: colors.border,
      backgroundColor: colors.surfaceSecondary,
    },
    countrySideLocked: {
      opacity: 1,
    },
    flag: {
      fontSize: fontSize.lg,
    },
    dialPrefix: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      color: colors.text,
      minWidth: 36,
    },
    chevron: {
      fontSize: fontSize.sm,
      color: colors.textMuted,
      marginLeft: 2,
    },
    input: {
      flex: 1,
      paddingHorizontal: spacing.sm,
      paddingVertical: 0,
      fontSize: fontSize.base,
      color: colors.text,
      backgroundColor: colors.inputBackground,
    },
    errorText: {
      marginTop: spacing.xs,
      color: colors.errorText,
      fontSize: fontSize.sm,
      lineHeight: lineHeight.normal,
    },
    modalRoot: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text,
    },
    closeBtn: {
      padding: spacing.sm,
    },
    closeBtnLabel: {
      fontSize: fontSize.md,
      color: colors.primary,
      fontWeight: fontWeight.semibold,
    },
    search: {
      marginHorizontal: spacing.base,
      marginVertical: spacing.sm,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: fontSize.base,
      color: colors.text,
      backgroundColor: colors.inputBackground,
    },
    listContent: {
      paddingBottom: spacing['3xl'],
    },
    listRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.md,
      gap: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    listRowFlag: {
      fontSize: fontSize.xl,
    },
    listRowBody: {
      flex: 1,
    },
    listRowName: {
      fontSize: fontSize.base,
      color: colors.text,
      fontWeight: fontWeight.medium,
    },
    listRowDial: {
      fontSize: fontSize.sm,
      color: colors.textMuted,
      marginTop: 2,
    },
  });
}
