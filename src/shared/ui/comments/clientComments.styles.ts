import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

export function createClientCommentStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    sectionTitleColored: { color: colors.text },
    name: { color: colors.text },
    meta: { color: colors.text },
    dateRow: { color: colors.text },
    body: { color: colors.text },
  });
}

export function createCommentCardBg(bgcolor: string) {
  return StyleSheet.create({
    bg: { backgroundColor: bgcolor },
  });
}
