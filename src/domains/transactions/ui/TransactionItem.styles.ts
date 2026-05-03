import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import type { SemanticColors } from '@/ui/theme';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

export function createTransactionItemStyles(
  colors: Theme['colors'],
  semantic: SemanticColors,
) {
  return StyleSheet.create({
    pressable: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      backgroundColor: 'transparent',
    },
    colProducts: {
      flex: 2.2,
      minWidth: 0,
    },
    colPaid: {
      flex: 1,
      minWidth: 0,
      alignItems: 'center',
    },
    colStatus: {
      flex: 1,
      minWidth: 0,
      alignItems: 'center',
    },
    colDetails: {
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    productText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    amountText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: semantic.textMuted,
      textAlign: 'center',
      writingDirection: 'rtl',
    },
    dateText: {
      fontSize: fontSize.xs,
      color: semantic.textMuted,
      textAlign: 'right',
      writingDirection: 'rtl',
      marginTop: spacing.xs,
    },
    typeText: {
      fontSize: fontSize.xs,
      color: semantic.textMuted,
      textAlign: 'right',
      writingDirection: 'rtl',
      marginTop: 2,
    },
    statusBadge: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.sm,
      maxWidth: '100%',
    },
    statusBadgeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
      textAlign: 'center',
    },
    detailsIconHit: {
      width: 36,
      height: 36,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

export type TransactionItemStyleSet = ReturnType<
  typeof createTransactionItemStyles
>;
