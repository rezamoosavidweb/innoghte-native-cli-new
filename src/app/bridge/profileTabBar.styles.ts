import { StyleSheet } from 'react-native';

import { fontSize, fontWeight } from '@/ui/theme';
import { colors as colorPrimitives } from '@/ui/theme/colors';

export function createProfileAvatarChrome(dim: number, ringColor: string) {
  return StyleSheet.create({
    image: {
      width: dim,
      height: dim,
      borderRadius: dim / 2,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: ringColor,
    },
    placeholder: {
      width: dim,
      height: dim,
      borderRadius: dim / 2,
      backgroundColor: ringColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    initials: {
      color: colorPrimitives.white,
      fontSize: fontSize.xs,
      fontWeight: fontWeight.bold,
    },
  });
}

export function createMainTabBarLabelTint(color: string) {
  return StyleSheet.create({
    tint: { color },
  });
}
