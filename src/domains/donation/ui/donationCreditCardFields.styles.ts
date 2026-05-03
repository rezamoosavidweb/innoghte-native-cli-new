import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { SemanticColors } from '@/ui/theme';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

export const createDonationCreditCardFieldsStyles = (args: {
  semantic: SemanticColors;
}) => {
  const { semantic } = args;

  return StyleSheet.create({
    grid: { gap: spacing.md },
    field: { gap: spacing.xs },
    label: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: semantic.text,
    },
    input: {
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: semantic.border,
      backgroundColor: semantic.inputBackground,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: fontSize.base,
      color: semantic.text,
    },
    error: {
      fontSize: fontSize.xs,
      color: semantic.errorText,
    },
    row2: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    flex1: { flex: 1 },
    typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
    typeChip: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.sm,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: semantic.border,
      backgroundColor: semantic.surface,
    },
    typeChipOn: {
      borderColor: semantic.primary,
      backgroundColor: semantic.primarySoft,
    },
    typeChipText: { fontSize: fontSize.xs, color: semantic.text },
    inputLtr: { writingDirection: 'ltr' },
    inputCenter: { textAlign: 'center' },
  });
};

export function useDonationCreditCardFieldsStyles(semantic: SemanticColors) {
  return React.useMemo(
    () => createDonationCreditCardFieldsStyles({ semantic }),
    [semantic],
  );
}
