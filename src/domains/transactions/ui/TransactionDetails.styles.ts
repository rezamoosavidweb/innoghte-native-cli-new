import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

export function createTransactionDetailsStyles(colors: ThemeColors) {
  return StyleSheet.create({
    sheet: {
      paddingBottom: spacing.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    title: {
      flex: 1,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: colors.text,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    headerBalance: {
      width: 40,
      height: 40,
    },
    closePress: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeGlyph: {
      fontSize: fontSize.xl,
      color: colors.text,
    },
    scroll: {
      maxHeight: 440,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    detailsCard: {
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSecondary,
      padding: spacing.md,
      gap: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    label: {
      flex: 1,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    value: {
      flex: 1,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text,
      textAlign: 'left',
      writingDirection: 'rtl',
    },
    paymentPill: {
      paddingVertical: 4,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.sm,
    },
    paymentPillText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginVertical: spacing.xs,
    },
    totalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
      marginTop: spacing.xs,
    },
    totalLabel: {
      flex: 1,
      fontSize: fontSize.base,
      fontWeight: fontWeight.bold,
      color: colors.text,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    totalValue: {
      flex: 1,
      fontSize: fontSize.base,
      fontWeight: fontWeight.bold,
      color: colors.text,
      textAlign: 'left',
      writingDirection: 'rtl',
    },
    primaryButton: {
      marginHorizontal: spacing.lg,
      marginTop: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButtonText: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      color: colors.onPrimary,
    },
  });
}

export type TransactionDetailsStyleSet = ReturnType<
  typeof createTransactionDetailsStyles
>;
