import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '@react-navigation/elements';

import { fontWeight, spacing } from '@/shared/styles/theme';

import type { MainTabScreenName } from '@/shared/navigation/types';

const TAB_GLYPH: Record<MainTabScreenName, string> = {
  Home: '🏠',
  MyCourses: '🗂️',
  Search: '🔍',
  Courses: '🎓',
  Albums: '💿',
  Faqs: '❓',
  Notifications: '🔔',
  Profile: '👤',
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
  glyph: {
    fontWeight: fontWeight.bold,
  },
  glyphFocused: {
    opacity: 1,
  },
  glyphBlurred: {
    opacity: 0.55,
  },
  badgeAnchor: {
    position: 'absolute',
    right: -spacing.sm,
    top: -(spacing.md - spacing.xs),
  },
});

/** Tab icons without extra native deps; swap for vector icons when you add them. */
export function TabBarGlyph({
  routeName,
  focused,
  color: _color,
  size,
  badgeCount = 0,
}: IconProps) {
  const glyph = TAB_GLYPH[routeName];
  const sized = React.useMemo(
    () =>
      StyleSheet.create({
        glyphSized: { fontSize: size - 2 },
      }).glyphSized,
    [size],
  );

  return (
    <View style={styles.wrap}>
      <Text
        style={[
          styles.glyph,
          sized,
          focused ? styles.glyphFocused : styles.glyphBlurred,
        ]}
      >
        {glyph}
      </Text>
      {routeName === 'Notifications' ? (
        <View style={styles.badgeAnchor}>
          <Badge visible={badgeCount > 0} size={spacing.base}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Badge>
        </View>
      ) : null}
    </View>
  );
}
