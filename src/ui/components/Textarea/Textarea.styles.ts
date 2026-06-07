import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontSize, radius, spacing } from '@/ui/theme';

export function createTextareaStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: {
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.inputBackground,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    wrapError: { borderColor: colors.error },
    input: {
      color: colors.text,
      fontSize: fontSize.base,
      minHeight: 84,
      textAlignVertical: 'top',
      textAlign: 'right',
      paddingVertical: 0,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.xs,
      gap: spacing.sm,
    },
    error: { flex: 1, fontSize: fontSize.xs, color: colors.errorText },
    counter: { fontSize: fontSize.xs, color: colors.textMuted, textAlign: 'left' },
  });
}
