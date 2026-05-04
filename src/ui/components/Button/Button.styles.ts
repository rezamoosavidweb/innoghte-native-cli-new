import { StyleSheet } from 'react-native';

import {
  fontSize,
  fontWeight,
  FORM_CONTROL_HEIGHT,
  radius,
  spacing,
} from '@/ui/theme';
import type { ThemeColors } from '@/ui/theme/types';

/**
 * Matches {@link createAuthEntryScreenStyles} `button` / `buttonOutline` / labels
 * for `filled` and `outlined`. `text` follows the same typography scale as
 * register/login footer links (`fontSize.sm`, semibold, primary).
 */
export function createButtonStyles(colors: ThemeColors) {
  return StyleSheet.create({
    filled: {
      width: '100%',
      height: FORM_CONTROL_HEIGHT,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      overflow: 'hidden',
    },
    filledLabel: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      color: '#fff',
    },
    outlined: {
      width: '100%',
      height: FORM_CONTROL_HEIGHT,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.primary,
      overflow: 'hidden',
    },
    outlinedLabel: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      color: colors.primary,
    },
    text: {
      height: FORM_CONTROL_HEIGHT,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      minWidth: 44,
      overflow: 'hidden',
    },
    textLabel: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.primary,
    },
    disabled: {
      opacity: 0.45,
    },
    pressed: {
      opacity: 0.88,
    },
    content: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    labelHidden: {
      opacity: 0,
    },
    loaderOverlay: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
