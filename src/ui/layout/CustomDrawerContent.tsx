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

const DEMO_USER = {
  name: 'Alex Rivera',
  email: 'alex@example.com',
  initials: 'AR',
} as const;

export const CustomDrawerContent = React.memo(function CustomDrawerContent(
  props: DrawerContentComponentProps,
) {
  const { state, navigation, descriptors } = props;
  const { t } = useTranslation();
  const { onRequestLogout, isDrawerOnPhysicalRight: isDrawerOnRight } =
    useShellDrawerModel();
  const { colors, dark } = useTheme();
  const s = pickSemantic(dark);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        safe: {
          flex: 1,
          backgroundColor: 'transparent',
        },
        profileSection: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing['3xl'],
          paddingVertical: spacing.base,
          backgroundColor: s.drawerMutedSurface,
        },
        avatar: {
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: s.drawerActiveTint,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: s.drawerActiveTint,
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
        divider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.border,
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
        footerIcon: {
          fontSize: fontSize.lg,
          color: s.danger,
          marginRight: spacing.md - 2,
        },
        footerItemText: {
          fontSize: fontSize.base,
          color: s.danger,
          fontWeight: fontWeight.semibold,
        },
        version: {
          fontSize: fontSize.sm,
          color: s.textMuted,
          textAlign: 'center',
          marginTop: 4,
          marginBottom: spacing.sm,
        },
        sheet: {
          flex: 1,
          backgroundColor: colors.card,
          borderTopLeftRadius: isDrawerOnRight ? radius['2xl'] : 0,
          borderBottomLeftRadius: isDrawerOnRight ? radius['2xl'] : 0,
          borderTopRightRadius: isDrawerOnRight ? 0 : radius['2xl'],
          borderBottomRightRadius: isDrawerOnRight ? 0 : radius['2xl'],
          overflow: 'hidden',
        },
      }),
    [colors.border, colors.card, colors.text, isDrawerOnRight, s],
  );

  const handleLogout = async (): Promise<void> => {
    await onRequestLogout();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.sheet}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{DEMO_USER.initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{DEMO_USER.name}</Text>
            <Text style={styles.userEmail}>{DEMO_USER.email}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.scrollContent}
        >
          <DrawerItemList
            state={state}
            navigation={navigation}
            descriptors={descriptors}
          />
        </DrawerContentScrollView>

        <View style={styles.footer}>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.footerItem} onPress={handleLogout}>
            <Text style={styles.footerIcon}>⎋</Text>
            <Text style={styles.footerItemText}>
              {t('drawerFooter.logout')}
            </Text>
          </TouchableOpacity>
          <Text style={styles.version}>
            {t('drawerFooter.version', { version: '0.0.1' })}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
});
