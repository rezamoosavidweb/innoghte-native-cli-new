import type { Theme } from '@react-navigation/native';
import { StyleSheet, type ViewStyle } from 'react-native';

import { radius } from '@/ui/theme/core/radius';
import { spacing } from '@/ui/theme/core/spacing';

export function createCardStyle(
  navColors: Theme['colors'],
  options?: { gap?: number; marginBottom?: number },
): ViewStyle {
  return {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: navColors.border,
    backgroundColor: navColors.card,
    padding: spacing.lg,
    ...options,
  };
}
