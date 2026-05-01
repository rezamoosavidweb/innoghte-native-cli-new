import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';

export type ProfileAvatarPickerStyles = ReturnType<
  typeof createProfileAvatarPickerStyles
>;

export function createProfileAvatarPickerStyles(colors: ThemeColors) {
  return StyleSheet.create({
    frame: {
      borderColor: colors.border,
      backgroundColor: colors.inputBackground,
    },
    framePressed: { opacity: 0.92 },
    placeholderMuted: {
      color: colors.textMuted,
    },
    hintMuted: {
      color: colors.textMuted,
    },
    errorTint: {
      color: colors.errorText,
    },
  });
}
