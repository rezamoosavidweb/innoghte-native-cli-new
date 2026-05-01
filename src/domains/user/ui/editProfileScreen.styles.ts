import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { spacing } from '@/ui/theme/core/spacing';
import { fontSize } from '@/ui/theme/core/typography';

export type EditProfileScreenStyles = ReturnType<
  typeof createEditProfileScreenStyles
>;

export function createEditProfileScreenStyles(
  navColors: Theme['colors'],
  ui: ThemeColors,
) {
  return StyleSheet.create({
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: '700',
      color: navColors.text,
      marginBottom: spacing.md,
    },
    stackLg: { gap: spacing.lg },
    stackSm: { gap: spacing.sm },
    fieldLabel: { color: navColors.text, fontWeight: '600' },
    requiredMark: { color: ui.errorText },
    inputDisabled: { opacity: 0.65 },
    bannerSuccess: { color: ui.successText },
    bannerError: { color: ui.errorText },
  });
}
