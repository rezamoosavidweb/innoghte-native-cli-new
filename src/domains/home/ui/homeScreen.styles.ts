import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import { spacing } from '@/ui/theme';

export function createHomeScreenStyles(themeColors: Theme['colors']) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingBottom: spacing['7xl'],
      gap: spacing.md,
    },
  });
}
