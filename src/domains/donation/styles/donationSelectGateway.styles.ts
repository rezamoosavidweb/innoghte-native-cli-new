import { StyleSheet } from 'react-native';

import type { SemanticColors, ThemeColors } from '@/ui/theme';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

export const createDonationSelectGatewayStyles = (args: {
  colors: ThemeColors;
  semantic: SemanticColors;
}) => {
  const { colors, semantic } = args;

  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    chip: {
      flexGrow: 1,
      minWidth: '40%',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: semantic.border,
      alignItems: 'center',
      backgroundColor: colors.card,
    },
    chipActive: {
      borderWidth: 2,
      borderColor: '#444',
    },
    chipLabel: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.text,
    },
    chipDisabled: { opacity: 0.45 },
  });
};
