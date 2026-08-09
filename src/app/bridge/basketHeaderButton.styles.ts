import {StyleSheet} from 'react-native';

import {colors, fontSize, fontWeight} from '@/ui/theme';

export const basketHeaderButtonStyles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -5,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger[500],
  },
  badgeText: {
    color: colors.white,
    fontSize: fontSize.xs,
    lineHeight: 16,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
});
