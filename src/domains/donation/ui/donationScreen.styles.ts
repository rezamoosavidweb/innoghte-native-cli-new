import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { SemanticColors } from '@/ui/theme';
import {
  fontSize,
  fontWeight,
  FORM_CONTROL_HEIGHT,
  hexAlpha,
  lineHeight,
  radius,
  spacing,
} from '@/ui/theme';

export const createDonationScreenStyles = (args: {
  background: string;
  semantic: SemanticColors;
  isCustomAmount?: boolean;
}) => {
  const { background, semantic } = args;

  return StyleSheet.create({
    keyboardRoot: { flex: 1, backgroundColor: background },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing['4xl'],
    },

    topSection: { marginBottom: spacing.md },
    topTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: semantic.text,
      marginBottom: spacing.sm,
    },
    topSubtitle: {
      fontSize: fontSize.base,
      color: semantic.textSecondary,
      lineHeight: lineHeight.relaxed,
    },

    hero: {
      width: '100%',
      height: 200,
      borderRadius: radius.lg,
      backgroundColor: semantic.surfaceSecondary,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: semantic.border,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    heroImage: { width: '100%', height: '100%' },

    sectionHeading: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: semantic.text,
      textAlign: 'center',
      marginBottom: spacing.md,
    },

    amountGroup: { gap: spacing.md, marginBottom: spacing.lg },
    paymentGroup: { gap: spacing.sm, marginBottom: spacing.lg },

    amountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    currency: { color: semantic.textSecondary, fontSize: fontSize.base },
    amountInput: {
      flex: 1,
      maxWidth: '52%',
      borderRadius: radius.lg,
      borderWidth: 2,
      borderColor: semantic.border,
      backgroundColor: semantic.surface,
      height: FORM_CONTROL_HEIGHT,
      paddingVertical: 0,
      paddingHorizontal: spacing.sm,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.medium,
      color: semantic.text,
      textAlign: 'center',
    },
    amountInputActive: {
      borderColor: semantic.primary,
      backgroundColor: hexAlpha(semantic.primary, 0.12),
    },

    presetsRow: { flexDirection: 'row', gap: spacing.sm },
    amtBtn: {
      flex: 1,
      height: FORM_CONTROL_HEIGHT,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: semantic.border,
      backgroundColor: semantic.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    amtBtnOn: {
      borderColor: semantic.primary,
      backgroundColor: semantic.primarySoft,
    },
    amtBtnText: {
      color: semantic.text,
      fontWeight: fontWeight.semibold,
      fontSize: fontSize.sm,
    },
    amtBtnTextOn: { color: semantic.primary },

    customBtn: {
      height: FORM_CONTROL_HEIGHT,
      borderRadius: radius.md,
      backgroundColor: semantic.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    customBtnText: {
      color: semantic.onPrimary,
      fontWeight: fontWeight.semibold,
      fontSize: fontSize.sm,
    },

    paymentHeading: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: semantic.text,
      marginBottom: spacing.sm,
    },

    sepLine: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: semantic.border,
      marginVertical: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.bold,
      color: semantic.text,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },

    fieldsGap: { gap: spacing.md },
    label: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: semantic.textSecondary,
      marginBottom: spacing.xs,
    },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: semantic.border,
      backgroundColor: semantic.inputBackground,
      paddingHorizontal: spacing.md,
      height: FORM_CONTROL_HEIGHT,
    },
    input: {
      flex: 1,
      color: semantic.text,
      fontSize: fontSize.base,
      paddingVertical: 0,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    inputLtr: { textAlign: 'left', writingDirection: 'ltr' },
    fieldError: { color: semantic.errorText, fontSize: fontSize.xs },

    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
      flexWrap: 'wrap',
      marginTop: spacing.lg,
    },
    total: {
      color: semantic.text,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      flex: 1,
      minWidth: 150,
    },
    payBtn: {
      backgroundColor: semantic.primary,
      height: FORM_CONTROL_HEIGHT,
      paddingHorizontal: spacing['2xl'],
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    payBtnDisabled: { opacity: 0.6 },
    payBtnText: {
      color: semantic.onPrimary,
      fontWeight: fontWeight.semibold,
      fontSize: fontSize.base,
    },
  });
};

export function useDonationScreenStyles(
  background: string,
  semantic: SemanticColors,
  isCustomAmount: boolean,
) {
  return React.useMemo(
    () => createDonationScreenStyles({ background, semantic, isCustomAmount }),
    [background, isCustomAmount, semantic],
  );
}
