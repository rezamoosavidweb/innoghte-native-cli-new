import { Badge } from '@react-navigation/elements';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import HeadphoneIcon from '@/assets/icons/headphone.svg';
import HomeIcon from '@/assets/icons/home.svg';
import LoginIcon from '@/assets/icons/login.svg';
import SchoolIcon from '@/assets/icons/school.svg';
import ShoppingTrollyIcon from '@/assets/icons/shopping-trolly.svg';
import type { MainTabScreenName } from '@/shared/contracts/navigationApp';
import { formatNumberForApp } from '@/shared/infra/i18n/formatLocaleNumbers';
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

/** Larger than default tab badge; forced square so it renders as a circle (not a pill). */
const CART_TAB_BADGE_SIZE = spacing['2xl'];

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
    left: -spacing.sm,
    top: -(spacing.md - spacing.xs),
  },
  cartTabBadge: {
    alignSelf: 'center',
    paddingHorizontal: 0,
    width: CART_TAB_BADGE_SIZE,
    height: CART_TAB_BADGE_SIZE,
    minWidth: CART_TAB_BADGE_SIZE,
    maxWidth: CART_TAB_BADGE_SIZE,
    borderRadius: CART_TAB_BADGE_SIZE / 2,
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
  useTranslation();
  const Icon = TAB_ICON[routeName];

  return (
    <View style={styles.wrap}>
      <View style={focused ? styles.focused : styles.blurred}>
        <Icon width={size} height={size} color={color} />
      </View>
      {badgeCount > 0 ? (
        <View
          style={styles.badgeAnchor}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Badge visible size={CART_TAB_BADGE_SIZE} style={styles.cartTabBadge}>
            {badgeCount > 99 ? `${formatNumberForApp(99)}+` : formatNumberForApp(badgeCount)}
          </Badge>
        </View>
      ) : null}
    </View>
  );
}
