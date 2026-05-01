import { StyleSheet } from 'react-native';

import {
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '@/ui/theme';
import type { ThemeColors } from '@/ui/theme/types';

export function createSettingsScreenStyles(colors: ThemeColors) {
  return StyleSheet.create({
    section: {
      marginTop: spacing.xl,
      width: '100%',
      maxWidth: 320,
      gap: spacing.md,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.md - 2,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    chip: {
      paddingVertical: 10,
      paddingHorizontal: spacing.base,
      borderRadius: radius.lg - 2,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.chipBorder,
      backgroundColor: colors.chipBackground,
    },
    chipActive: {
      borderColor: colors.chipActiveBorder,
      backgroundColor: colors.chipActiveBackground,
    },
    chipText: {
      fontSize: fontSize.md + 1,
      fontWeight: fontWeight.semibold,
      color: colors.text,
    },
  });
}
