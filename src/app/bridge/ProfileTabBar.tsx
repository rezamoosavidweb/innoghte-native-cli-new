import * as React from 'react';
import { useTheme } from '@react-navigation/native';
import {Image, StyleSheet, View} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/ui/Text';

import { TabBarGlyph } from '@/app/navigation/tabBarConfig';
import { useCurrentUser } from '@/domains/auth';
import { useIsAuthenticated } from '@/domains/auth';
import { resolveAvatarUri } from '@/shared/utils/resolveAvatarUri';
import { initialsFromDisplayName } from '@/shared/utils/initialsFromDisplayName';
import {
  fontSize,
  fontWeight,
  mainTabBarLabelStyle,
  pickSemantic,
  spacing,
} from '@/ui/theme';
import { colors as colorPrimitives } from '@/ui/theme/colors';

const glyphWrap = StyleSheet.create({
  wrap: {
    width: spacing['5xl'],
    height: spacing['5xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  focused: { opacity: 1 },
  blurred: { opacity: 0.55 },
});

type IconProps = {
  color: string;
  focused: boolean;
  size: number;
};

export function ProfileTabBarIcon({ color, focused, size }: IconProps) {
  const theme = useTheme();
  const s = pickSemantic(theme);
  const isAuthenticated = useIsAuthenticated();
  const { t } = useTranslation();
  const { data: userRes } = useCurrentUser();
  const user = userRes?.data;

  const dim = Math.round(size);
  const ringColor = s.tabActive;

  const avatarVisual = React.useMemo(
    () => ({
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
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
      initials: {
        color: colorPrimitives.white,
        fontSize: fontSize.xs,
        fontWeight: fontWeight.bold,
      },
    }),
    [dim, ringColor],
  );

  if (!isAuthenticated) {
    return (
      <TabBarGlyph
        routeName="Profile"
        focused={focused}
        color={color}
        size={size}
      />
    );
  }

  const displayName = (
    user?.full_name?.trim() ||
    [user?.name, user?.family].filter(Boolean).join(' ').trim() ||
    t('drawer.user.fallbackName')
  ).trim();
  const initials = initialsFromDisplayName(displayName);
  const uri = resolveAvatarUri(user?.avatar);

  return (
    <View
      style={[
        glyphWrap.wrap,
        focused ? glyphWrap.focused : glyphWrap.blurred,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          accessibilityIgnoresInvertColors
          style={avatarVisual.image}
          resizeMode="cover"
        />
      ) : (
        <View style={avatarVisual.placeholder}>
          <Text style={avatarVisual.initials} numberOfLines={1}>
            {initials}
          </Text>
        </View>
      )}
    </View>
  );
}

type LabelProps = {
  color: string;
};

export function ProfileTabBarLabel({ color }: LabelProps) {
  const { t } = useTranslation();
  const isAuthenticated = useIsAuthenticated();
  const label = isAuthenticated ? t('tabs.profile') : t('tabs.signinup');

  return (
    <Text style={[mainTabBarLabelStyle, { color }]} numberOfLines={1}>
      {label}
    </Text>
  );
}
