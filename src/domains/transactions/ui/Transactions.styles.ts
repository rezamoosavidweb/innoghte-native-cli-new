import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import type { SemanticColors } from '@/ui/theme';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

export function createTransactionsStyles(
  colors: Theme['colors'],
  semantic: SemanticColors,
) {
  return StyleSheet.create({
    listFill: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: spacing.sm,
      paddingBottom: spacing['3xl'],
    },
    tableCard: {
      flex: 1,
      minHeight: 200,
      borderRadius: radius.lg,
      overflow: 'hidden',
      backgroundColor: semantic.surfaceSecondary ?? colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    tableHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: hexAlpha(colors.border, 0.45),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    headerCellProducts: {
      flex: 2.2,
      minWidth: 0,
    },
    headerCellPaid: {
      flex: 1,
      minWidth: 0,
      alignItems: 'center',
    },
    headerCellStatus: {
      flex: 1,
      minWidth: 0,
      alignItems: 'center',
    },
    headerCellDetails: {
      width: 40,
      alignItems: 'center',
    },
    headerText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
      color: semantic.textMuted,
      textAlign: 'center',
      writingDirection: 'rtl',
    },
    headerTextProducts: {
      textAlign: 'right',
    },
    rowSeparator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
    metaLine: {
      fontSize: fontSize.xs,
      color: semantic.textMuted,
      textAlign: 'right',
      writingDirection: 'rtl',
      marginTop: spacing.xs,
    },
  });
}

export type TransactionsStyleSet = ReturnType<typeof createTransactionsStyles>;
