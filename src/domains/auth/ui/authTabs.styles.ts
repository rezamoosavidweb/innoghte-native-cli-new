import { StyleSheet } from 'react-native';

import { fontSize, fontWeight, FORM_CONTROL_HEIGHT, radius } from '@/ui/theme';
import type { ThemeColors } from '@/ui/theme/types';

export function createAuthTabsStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      padding: 4,
      width: '100%',
    },
    tab: {
      flex: 1,
      height: FORM_CONTROL_HEIGHT,
      borderRadius: radius.lg - 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabActive: {
      backgroundColor: colors.primary,
    },
    tabLabel: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.textSecondary,
    },
    tabLabelActive: {
      color: '#ffffff',
    },
  });
}
