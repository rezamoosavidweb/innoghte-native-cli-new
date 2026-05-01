import { StyleSheet } from 'react-native';

import { spacing } from '@/ui/theme';

export function createSwiperCellStyles(itemWidth: number, gap: number) {
  return StyleSheet.create({
    cell: { width: itemWidth, marginRight: gap },
    cellLast: { width: itemWidth, marginRight: 0 },
  });
}

export function createSwiperContentInsetStyles(paddingHorizontal: number) {
  return StyleSheet.create({
    content: { paddingHorizontal },
  });
}

export function createSwiperDotPaletteStyles(
  idleBackground: string,
  activeFill: string,
) {
  return StyleSheet.create({
    idle: { backgroundColor: idleBackground },
    active: { backgroundColor: activeFill },
  });
}

export const swiperDotStatic = StyleSheet.create({
  dots: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: spacing.md,
    gap: spacing.xs + 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 22,
  },
});
