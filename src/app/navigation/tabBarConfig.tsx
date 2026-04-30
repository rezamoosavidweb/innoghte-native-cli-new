import { Badge } from '@react-navigation/elements';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import HeadphoneIcon from '@/assets/icons/headphone.svg';
import HomeIcon from '@/assets/icons/home.svg';
import LoginIcon from '@/assets/icons/login.svg';
import SchoolIcon from '@/assets/icons/school.svg';
import ShoppingTrollyIcon from '@/assets/icons/shopping-trolly.svg';
import type { MainTabScreenName } from '@/shared/contracts/navigationApp';
import { spacing } from '@/ui/theme';

const TAB_ICON: Record<MainTabScreenName, React.ComponentType<SvgProps>> = {
  Home: HomeIcon,
  PublicCourses: SchoolIcon,
  PublicAlbums: HeadphoneIcon,
  Cart: ShoppingTrollyIcon,
  Profile: LoginIcon,
};

type IconProps = {
  routeName: MainTabScreenName;
  focused: boolean;
  color: string;
  size: number;
  badgeCount?: number;
};

const styles = StyleSheet.create({
  wrap: {
    width: spacing['5xl'],
    height: spacing['5xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  focused: {
    opacity: 1,
  },
  blurred: {
    opacity: 0.55,
  },
  badgeAnchor: {
    position: 'absolute',
    right: -spacing.sm,
    top: -(spacing.md - spacing.xs),
  },
});

/** Tab icons from `@/assets/icons` (SVGR). */
export function TabBarGlyph({
  routeName,
  focused,
  color,
  size,
  badgeCount = 0,
}: IconProps) {
  const Icon = TAB_ICON[routeName];

  return (
    <View style={[styles.wrap, focused ? styles.focused : styles.blurred]}>
      <Icon width={size} height={size} color={color} />
      {badgeCount > 0 ? (
        <View
          style={styles.badgeAnchor}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Badge visible size={spacing.sm}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Badge>
        </View>
      ) : null}
    </View>
  );
}
