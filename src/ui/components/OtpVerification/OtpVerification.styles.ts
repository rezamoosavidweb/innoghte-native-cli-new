import { StyleSheet } from 'react-native';

import { spacing } from '@/ui/theme/core/spacing';
import { fontSize, fontWeight, lineHeight } from '@/ui/theme/core/typography';
import type { ThemeColors } from '@/ui/theme/types';

export function createOtpVerificationStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: { gap: spacing.md },
    title: {
      color: colors.text,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      textAlign: 'center',
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: fontSize.base,
      lineHeight: lineHeight.normal,
      textAlign: 'center',
    },
    resendRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    resendText: {
      color: colors.textSecondary,
      fontSize: fontSize.sm,
    },
    resendLink: {
      color: colors.primary,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
    },
    resendTimer: {
      color: colors.primary,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
    },
  });
}
