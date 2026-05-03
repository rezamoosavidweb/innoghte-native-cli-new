import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { createCardStyle } from '@/ui/theme/core/card.styles';
import { radius } from '@/ui/theme/core/radius';
import { FORM_CONTROL_HEIGHT } from '@/ui/theme/core/formControlHeight';
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
    card: createCardStyle(navColors, { gap: spacing.lg }),
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: '700',
      color: navColors.text,
      marginBottom: spacing.sm,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    textInput: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.md,
      borderColor: navColors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: 0,
      height: FORM_CONTROL_HEIGHT,
      fontSize: fontSize.base,
      color: navColors.text,
      backgroundColor: ui.inputBackground,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    stackLg: { gap: spacing.lg },
    stackSm: { gap: spacing.sm },
    fieldLabel: {
      color: navColors.text,
      fontWeight: '600',
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    requiredMark: { color: ui.errorText },
    inputDisabled: { opacity: 0.65 },
    textInputLtr: {
      textAlign: 'left',
      writingDirection: 'ltr',
    },
    bannerSuccess: { color: ui.successText },
    bannerError: { color: ui.errorText },
  });
}
