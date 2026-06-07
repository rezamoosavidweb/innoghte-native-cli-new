import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { SemanticColors, ThemeColors } from '@/ui/theme';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

export const createDonationSelectGatewayStyles = (args: {
  colors: ThemeColors;
  semantic: SemanticColors;
}) => {
  const { colors, semantic } = args;

  return StyleSheet.create({
    // Mirrors the basket gateway row (paymentSection.styles `gw` / `gwOn`).
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    chip: {
      flex: 1,
      minHeight: 60,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: semantic.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: semantic.surfaceSecondary,
    },
    chipActive: {
      borderColor: semantic.primary,
      backgroundColor: semantic.primarySoft,
    },
    chipLabel: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text,
    },
  });
};

export function useDonationSelectGatewayStyles(
  cardColor: string,
  textColor: string,
  semantic: SemanticColors,
) {
  return React.useMemo(
    () =>
      createDonationSelectGatewayStyles({
        colors: { ...semantic, card: cardColor, text: textColor },
        semantic,
      }),
    [cardColor, semantic, textColor],
  );
}
