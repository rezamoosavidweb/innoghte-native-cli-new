import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import {
  colors,
  fontSize,
  fontWeight,
  pickSemantic,
  radius,
  spacing,
} from '@/ui/theme';

type Semantic = ReturnType<typeof pickSemantic>;

export function createCartMainButtonsStyles(
  themeColors: Theme['colors'],
  semantic: Semantic,
) {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    pressableBase: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    },
    pressed: {
      opacity: 0.88,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      maxWidth: '100%',
    },
    label: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      textAlign: 'center',
    },
    primaryBg: {
      backgroundColor: themeColors.primary,
    },
    primaryText: {
      color: semantic.onPrimary,
    },
    successBg: {
      backgroundColor: semantic.success,
    },
    successBorder: {
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: semantic.successButton,
      backgroundColor: semantic.successButton,
    },
    successLabel: {
      color: colors.white,
    },
    capacityWrap: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: themeColors.border,
      minHeight: 44,
    },
    capacityText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.white,
      textAlign: 'center',
    },
  });
}
