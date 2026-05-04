import * as React from 'react';
import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import type { NavigationThemeWithScheme } from '@/ui/theme/navigationThemeContract';
import {
  colors,
  fontSize,
  fontWeight,
  FORM_CONTROL_HEIGHT,
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
      paddingHorizontal: spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      height: FORM_CONTROL_HEIGHT,
    },
    pressed: {
      opacity: 0.88,
    },
    row:{
      flexDirection: 'row',
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
      color: '#ffffff',
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
      paddingHorizontal: spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: themeColors.border,
      height: FORM_CONTROL_HEIGHT,
    },
    capacityText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.white,
      textAlign: 'center',
    },
    /** Fills {@link pressableBase} so a spinner overlay does not change layout height. */
    addToCartSlot: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addToCartLabelHidden: {
      opacity: 0,
    },
    addToCartLoaderOverlay: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonOutlinedText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: themeColors.primary,
    },
    buttonOutlined: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: themeColors.primary,
    },
  });
}

export function useCartMainButtonsStyles(theme: NavigationThemeWithScheme) {
  const semantic = pickSemantic(theme);
  const { colors: themeColors } = theme;
  return React.useMemo(
    () => createCartMainButtonsStyles(themeColors, semantic),
    [semantic, themeColors],
  );
}
