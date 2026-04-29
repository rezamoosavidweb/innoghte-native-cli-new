import * as React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useShellDrawerModel } from '@/ui/layout/ShellDrawerContext';
import {
  colors as colorPrimitives,
  fontSize,
  fontWeight,
  pickSemantic,
  radius,
  spacing,
} from '@/ui/theme';
import { version as appVersion } from '../../../package.json';

const staticDrawerStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  profileSectionBase: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['3xl'],
    paddingVertical: spacing.base,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  avatarText: {
    color: colorPrimitives.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  dividerHairline: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.md,
  },
  scrollContent: {
    paddingTop: spacing.sm,
  },
  footer: {
    paddingBottom: spacing.sm,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing['3xl'],
  },
  footerIconGlyph: {
    fontSize: fontSize.lg,
    marginRight: spacing.md - 2,
  },
  footerItemTextBase: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  versionBase: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.sm,
  },
});

export const CustomDrawerContent = React.memo(function CustomDrawerContent(
  props: DrawerContentComponentProps,
) {
  const { state, navigation, descriptors } = props;
  const { t } = useTranslation();
  const { onRequestLogout, isDrawerOnPhysicalRight: isDrawerOnRight, user: drawerUser } =
    useShellDrawerModel();
  const { colors, dark } = useTheme();
  const s = pickSemantic(dark);
  const displayName = drawerUser.displayName;
  const emailLine = drawerUser.emailLine;
  const avatarInitials = drawerUser.avatarInitials;

  const dynamicStyles = React.useMemo(
    () => ({
      profileSection: [
        staticDrawerStyles.profileSectionBase,
        { backgroundColor: s.drawerMutedSurface },
      ],
      avatar: [
        staticDrawerStyles.avatar,
        {
          backgroundColor: s.drawerActiveTint,
          borderColor: s.drawerActiveTint,
        },
      ],
      userName: {
        fontSize: fontSize.base + 1,
        fontWeight: fontWeight.bold,
        color: colors.text,
      },
      userEmail: {
        fontSize: fontSize.md,
        color: s.textSecondary,
        marginTop: 2,
      },
      divider: [
        staticDrawerStyles.dividerHairline,
        { backgroundColor: colors.border },
      ],
      footerIconGlyph: [
        staticDrawerStyles.footerIconGlyph,
        { color: s.danger },
      ],
      footerItemText: [
        staticDrawerStyles.footerItemTextBase,
        { color: s.danger },
      ],
      version: [staticDrawerStyles.versionBase, { color: s.textMuted }],
      sheet: {
        flex: 1,
        backgroundColor: colors.card,
        borderTopLeftRadius: isDrawerOnRight ? radius['2xl'] : 0,
        borderBottomLeftRadius: isDrawerOnRight ? radius['2xl'] : 0,
        borderTopRightRadius: isDrawerOnRight ? 0 : radius['2xl'],
        borderBottomRightRadius: isDrawerOnRight ? 0 : radius['2xl'],
        overflow: 'hidden' as const,
      },
    }),
    [colors.border, colors.card, colors.text, isDrawerOnRight, s],
  );

  const handleLogout = React.useCallback(() => {
    return onRequestLogout();
  }, [onRequestLogout]);

  return (
    <SafeAreaView style={staticDrawerStyles.safe} edges={['top', 'bottom']}>
      <View style={dynamicStyles.sheet}>
        <View style={dynamicStyles.profileSection}>
          <View style={dynamicStyles.avatar}>
            <Text style={staticDrawerStyles.avatarText}>{avatarInitials}</Text>
          </View>
          <View style={staticDrawerStyles.profileInfo}>
            <Text style={dynamicStyles.userName}>{displayName}</Text>
            <Text style={dynamicStyles.userEmail}>{emailLine}</Text>
          </View>
        </View>

        <View style={dynamicStyles.divider} />

        <DrawerContentScrollView
          {...props}
          contentContainerStyle={staticDrawerStyles.scrollContent}
        >
          <DrawerItemList
            state={state}
            navigation={navigation}
            descriptors={descriptors}
          />
        </DrawerContentScrollView>

        <View style={staticDrawerStyles.footer}>
          <View style={dynamicStyles.divider} />
          <TouchableOpacity style={staticDrawerStyles.footerItem} onPress={handleLogout}>
            <Text style={dynamicStyles.footerIconGlyph}>⎋</Text>
            <Text style={dynamicStyles.footerItemText}>
              {t('drawerFooter.logout')}
            </Text>
          </TouchableOpacity>
          <Text style={dynamicStyles.version}>
            {t('drawerFooter.version', { version: appVersion })}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
});
