import { StyleSheet } from 'react-native';

import type { SemanticColors, ThemeColors } from '@/ui/theme';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

export const createDonationResultModalStyles = (args: {
  colors: ThemeColors;
  semantic: SemanticColors;
  titleColor: string;
}) => {
  const { colors, semantic, titleColor } = args;

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    card: {
      width: '100%',
      maxWidth: 320,
      borderRadius: radius.lg,
      backgroundColor: colors.card,
      padding: spacing.lg,
      gap: spacing.md,
    },
    closeRow: { alignItems: 'flex-end' },
    closeText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: semantic.textMuted,
    },
    title: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      textAlign: 'center',
      color: titleColor,
    },
    body: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      textAlign: 'center',
      color: colors.text,
      lineHeight: fontSize.base * 1.45,
    },
  });
};
