import { StyleSheet } from 'react-native';

import type { SemanticColors, ThemeColors } from '@/ui/theme';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

export const createDonationSelectPaymentTypeStyles = (args: {
  colors: ThemeColors;
  semantic: SemanticColors;
}) => {
  const { colors, semantic } = args;

  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    label: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.medium,
      color: colors.text,
    },
    chip: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: '#fff',
      opacity: 0.65,
    },
    chipOn: { opacity: 1 },
    chipText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: semantic.textMuted,
    },
    chipTextOn: { color: colors.text },
  });
};
