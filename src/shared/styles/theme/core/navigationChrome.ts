import type { Theme } from '@react-navigation/native';
import { Platform, StyleSheet } from 'react-native';

import { radius } from '@/shared/styles/theme/core/radius';
import { spacing } from '@/shared/styles/theme/core/spacing';
import { fontSize, fontWeight } from '@/shared/styles/theme/core/typography';

export const mainTabHeaderTitleStyle = StyleSheet.create({
  title: { fontWeight: fontWeight.bold },
}).title;

export const mainTabBarLabelStyle = StyleSheet.create({
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
}).label;

export function tabBarSurfaceStyle(theme: Theme) {
  return StyleSheet.create({
    tabBar: {
      backgroundColor: theme.colors.card,
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      height: Platform.OS === 'ios' ? 88 : 64,
      paddingBottom:
        Platform.OS === 'ios' ? spacing['5xl'] : spacing.md - 2,
      paddingTop: spacing.sm,
    },
  }).tabBar;
}

export const drawerChrome = StyleSheet.create({
  drawer: {
    width: '78%',
    backgroundColor: 'transparent',
  },
  radiusFromEnd: {
    borderTopLeftRadius: radius['2xl'],
    borderBottomLeftRadius: radius['2xl'],
  },
  radiusFromStart: {
    borderTopRightRadius: radius['2xl'],
    borderBottomRightRadius: radius['2xl'],
  },
  drawerLabel: {
    marginStart: -spacing.sm,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  drawerItem: {
    borderRadius: radius.md,
    marginHorizontal: spacing.sm,
    marginVertical: spacing.xs,
  },
});
