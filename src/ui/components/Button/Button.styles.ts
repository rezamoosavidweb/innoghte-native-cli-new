import { StyleSheet } from 'react-native';

import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';
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
      paddingVertical: spacing.md,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    filledLabel: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      color: '#fff',
    },
    outlined: {
      width: '100%',
      paddingVertical: spacing.md,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primaryBg,
      borderWidth: 0,
      borderColor: colors.primary,
    },
    outlinedLabel: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      color: colors.primary,
    },
    text: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      minHeight: 44,
      minWidth: 44,
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
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: fontSize.base + 2,
    },
  });
}
