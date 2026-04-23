import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '@react-navigation/elements';

import type { MainTabScreenName } from './types';

const TAB_GLYPH: Record<MainTabScreenName, string> = {
  Home: '🏠',
  Search: '🔍',
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

/** Tab icons without extra native deps; swap for vector icons when you add them. */
export function TabBarGlyph({
  routeName,
  focused,
  color: _color,
  size,
  badgeCount = 0,
}: IconProps) {
  const glyph = TAB_GLYPH[routeName];

  return (
    <View style={styles.wrap}>
      <Text
        style={[
          styles.glyph,
          { fontSize: size - 2 },
          focused ? styles.glyphFocused : styles.glyphBlurred,
        ]}
      >
        {glyph}
      </Text>
      {routeName === 'Notifications' ? (
        <View style={styles.badgeAnchor}>
          <Badge visible={badgeCount > 0} size={16}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Badge>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    fontWeight: '700',
  },
  glyphFocused: {
    opacity: 1,
  },
  glyphBlurred: {
    opacity: 0.55,
  },
  badgeAnchor: {
    position: 'absolute',
    right: -8,
    top: -6,
  },
});
