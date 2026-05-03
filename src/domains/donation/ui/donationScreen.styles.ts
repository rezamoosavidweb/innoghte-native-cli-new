import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { SemanticColors, ThemeColors } from '@/ui/theme';
import { fontSize, fontWeight, FORM_CONTROL_HEIGHT, radius, spacing } from '@/ui/theme';

export const createDonationScreenStyles = (args: {
  colors: ThemeColors;
  semantic: SemanticColors;
  isCustomAmount?: boolean;
}) => {
  const { colors, semantic, isCustomAmount = false } = args;

  return StyleSheet.create({
    topSection: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
    },
    topTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    topSubtitle: {
      fontSize: fontSize.base,
      color: colors.textSecondary,
      lineHeight: fontSize.base * 1.45,
    },
    darkSection: {
      flex: 1,
      backgroundColor: '#141726',
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing['3xl'],
      paddingTop: spacing.lg,
    },
    darkTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: '#fff',
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    amountCard: {
      backgroundColor: '#444965',
      borderRadius: radius.lg,
      padding: spacing.lg,
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    amountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    amountInput: {
      flex: 1,
      maxWidth: '50%',
      borderRadius: radius.lg,
      borderWidth: 2,
      borderColor: '#67BD5C',
      backgroundColor: 'rgba(103, 189, 92, 0.22)',
      height: FORM_CONTROL_HEIGHT,
      paddingVertical: 0,
      paddingHorizontal: spacing.sm,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.medium,
      color: '#fff',
      textAlign: 'center',
    },
    amountInputLocked: {
      opacity: isCustomAmount ? 1 : 0.95,
    },
    currency: {
      color: '#e4e4e4',
      fontSize: fontSize.base,
    },
    amountBtnsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    amtBtn: {
      flexGrow: 1,
      minWidth: '28%',
      height: FORM_CONTROL_HEIGHT,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: '#67BD5C',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    amtBtnOn: {
      backgroundColor: '#67BD5C',
    },
    amtBtnText: {
      color: '#67BD5C',
      fontWeight: fontWeight.semibold,
      fontSize: fontSize.sm,
    },
    amtBtnTextOn: { color: '#fff' },
    sepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.sm,
    },
    sepLine: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: '#E0E0E0',
    },
    formBlock: {
      backgroundColor: '#444965',
      borderRadius: radius.lg,
      padding: spacing.lg,
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.bold,
      color: '#fff',
      textAlign: 'center',
    },
    label: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: '#e4e4e4',
      marginBottom: spacing.xs,
    },
    input: {
      borderRadius: radius.lg,
      backgroundColor: '#eee',
      paddingHorizontal: spacing.md,
      paddingVertical: 0,
      height: FORM_CONTROL_HEIGHT,
      fontSize: fontSize.base,
      color: '#212121',
    },
    textarea: { minHeight: 88, textAlignVertical: 'top' },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
      flexWrap: 'wrap',
      marginTop: spacing.sm,
    },
    total: {
      color: '#fff',
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      flex: 1,
      minWidth: 160,
    },
    payBtn: {
      backgroundColor: '#67BD5C',
      height: FORM_CONTROL_HEIGHT,
      paddingHorizontal: spacing['2xl'],
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    payBtnDisabled: { opacity: 0.65 },
    payBtnText: {
      color: '#fff',
      fontWeight: fontWeight.semibold,
      fontSize: fontSize.base,
    },
    keyboardRoot: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollBottomPad: {
      paddingBottom: spacing['4xl'],
    },
    fieldsGap: {
      gap: spacing.md,
    },
    fieldError: {
      color: semantic.errorText,
      fontSize: fontSize.xs,
    },
    gatewayBlock: { marginTop: spacing.md },
    gatewayPanel: {
      backgroundColor: '#fff',
      borderRadius: radius.md,
      padding: spacing.md,
    },
  });
};

export function useDonationScreenStyles(
  background: string,
  semantic: SemanticColors,
  isCustomAmount: boolean,
) {
  return React.useMemo(
    () =>
      createDonationScreenStyles({
        colors: { ...semantic, background },
        semantic,
        isCustomAmount,
      }),
    [background, isCustomAmount, semantic],
  );
}
