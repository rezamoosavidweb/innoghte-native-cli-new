import { StyleSheet } from 'react-native';

import { radius } from '@/ui/theme/core/radius';
import { spacing } from '@/ui/theme/core/spacing';
import type { ThemeColors } from '@/ui/theme/types';

export function createBottomSheetStyles(colors: ThemeColors) {
  return StyleSheet.create({
    anchor: { flex: 1, justifyContent: 'flex-end' },
    sheet: {
      backgroundColor: colors.card,
      // Rounded top only — the sheet rises from and sticks to the bottom edge.
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      gap: spacing.md,
      // Bound the sheet so an inner ScrollView gets a real height constraint.
      maxHeight: '85%',
    },
  });
}
