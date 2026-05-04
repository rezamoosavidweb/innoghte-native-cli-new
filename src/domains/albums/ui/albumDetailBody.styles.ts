import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

export function createAlbumDetailBodyTextStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    title: { color: colors.text },
    short: { color: colors.text },
    full: { color: colors.text },
  });
}
