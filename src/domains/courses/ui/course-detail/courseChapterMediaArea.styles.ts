import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import { hexAlpha } from '@/ui/theme/utils/colorUtils';

export function createChapterMediaPlaceholderStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    placeholderBg: {
      backgroundColor: hexAlpha(colors.border, 0.2),
    },
    glyph: {
      color: colors.text,
    },
  });
}

export function createChapterMediaThemedStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    boxBorder: {
      borderColor: colors.border,
    },
    jsonTitle: {
      color: colors.text,
    },
    hint: {
      color: colors.text,
    },
    linkBtn: {
      backgroundColor: colors.primary,
    },
  });
}
