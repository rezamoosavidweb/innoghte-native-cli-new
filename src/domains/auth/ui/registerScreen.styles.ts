import { StyleSheet } from 'react-native';

import {
  fontSize,
  fontWeight,
  lineHeight,
  radius,
  spacing,
} from '@/ui/theme';
import type { ThemeColors } from '@/ui/theme/types';

export function createRegisterScreenStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    inner: {
      flexGrow: 1,
      padding: spacing.xl,
      justifyContent: 'center',
      gap: spacing.md,
      maxWidth: 400,
      alignSelf: 'center',
      width: '100%',
    },
    title: {
      fontSize: 26,
      fontWeight: fontWeight.bold,
      textAlign: 'center',
      color: colors.text,
    },
    sub: {
      fontSize: fontSize.md,
      lineHeight: lineHeight.snug,
      textAlign: 'center',
      opacity: 0.8,
      marginBottom: spacing.sm,
      color: colors.text,
    },
    errorText: {
      color: colors.errorText,
      fontSize: fontSize.sm,
      lineHeight: lineHeight.normal,
    },
    helperText: {
      color: colors.text,
      opacity: 0.7,
      fontSize: fontSize.sm,
    },
    loginCta: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.sm,
    },
    loginCtaText: {
      color: colors.textSecondary,
      fontSize: fontSize.sm,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    rowField: {
      flex: 1,
    },
    termsRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    checkboxBox: {
      width: 22,
      height: 22,
      borderRadius: radius.sm,
      borderWidth: 2,
      borderColor: colors.primary,
      marginTop: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxCheckedBg: {
      backgroundColor: colors.primary,
    },
    checkMark: {
      color: colors.onPrimary,
      fontSize: 13,
      fontWeight: fontWeight.bold,
    },
    termsText: {
      flex: 1,
      fontSize: fontSize.sm + 1,
      color: colors.text,
      lineHeight: lineHeight.normal,
    },
    resendRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      marginTop: spacing.sm,
    },
    resendText: {
      color: colors.textSecondary,
      fontSize: fontSize.sm,
    },
    resendLink: {
      color: colors.primary,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
    },
    resendTimer: {
      color: colors.primary,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
    },
    editInfoButton: {
      alignSelf: 'center',
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radius.md,
    },
    editInfoText: {
      color: colors.primary,
      fontSize: fontSize.sm,
    },
  });
}
