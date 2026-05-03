import { StyleSheet } from 'react-native';

import {
  fontSize,
  fontWeight,
  FORM_CONTROL_HEIGHT,
  lineHeight,
  radius,
  spacing,
} from '@/ui/theme';
import type { ThemeColors } from '@/ui/theme/types';

export function createVerifyScreenStyles(themeColors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: themeColors.background },
    scrollContent: {
      padding: spacing.xl,
      paddingBottom: spacing['3xl'],
      gap: spacing.lg,
      maxWidth: 440,
      width: '100%',
      alignSelf: 'center',
    },
    title: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.bold,
      color: themeColors.text,
    },
    subtitle: {
      fontSize: fontSize.md,
      lineHeight: lineHeight.normal,
      color: themeColors.text,
      opacity: 0.8,
    },
    fieldLabel: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: themeColors.text,
    },
    input: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.lg - 2,
      height: FORM_CONTROL_HEIGHT,
      paddingHorizontal: 14,
      paddingVertical: 0,
      fontSize: fontSize.base,
      borderColor: themeColors.border,
      color: themeColors.text,
      backgroundColor: themeColors.inputBackground,
    },
    primaryButton: {
      marginTop: spacing.sm,
      height: FORM_CONTROL_HEIGHT,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: themeColors.primary,
    },
    primaryButtonPressed: { opacity: 0.9 },
    primaryButtonDisabled: { opacity: 0.55 },
    primaryButtonLabel: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.bold,
      color: themeColors.onPrimary,
    },
    errorText: {
      color: themeColors.errorText,
      fontSize: fontSize.sm,
      lineHeight: lineHeight.normal,
    },
    hint: {
      fontSize: fontSize.xs,
      color: themeColors.text,
      opacity: 0.65,
    },
  });
}
