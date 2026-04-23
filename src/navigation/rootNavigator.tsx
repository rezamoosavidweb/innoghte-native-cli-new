import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Platform, StyleSheet, Text } from 'react-native';

import type { AppLanguage } from '../bootstrap/readAppLanguage';
import { isRtlLanguage } from '../utils/i18n-rtl';

import { CustomDrawerContent } from '../components/CustomDrawerContent';
import { DrawerMenuButton } from '../components/DrawerMenuButton';
import { AboutScreen } from '../screens/AboutScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { NOTIFICATION_BADGE_COUNT } from '../state/notificationBadge';
import { appBrand } from '../theme/navigationTheme';
import i18n from '../translations';

import {
  getDrawerLeafTranslatedFields,
  getDrawerMainTabsOptions,
  getTranslatedTabFields,
} from './i18nScreenOptions';
import { TabBarGlyph } from './tabBarConfig';
import type { DrawerParamList, MainTabScreenName, TabParamList } from './types';

function resolvedAppLanguage(): AppLanguage {
  return i18n.language === 'en' ? 'en' : 'fa';
}

const drawerOpensFromEnd = isRtlLanguage(resolvedAppLanguage());

const drawerIconStyles = StyleSheet.create({
  base: { fontWeight: '600' },
});

function mainTabsScreenOptions({
  route,
  theme,
}: {
  route: { name: string };
  theme: { colors: { card: string; border: string } };
}) {
  const t = i18n.t.bind(i18n);
  const { tabBarLabel, title } = getTranslatedTabFields(t, String(route.name));

  return {
    lazy: true,
    unmountOnBlur: false,
    headerLeft: () => <DrawerMenuButton />,
    headerStyle: { backgroundColor: appBrand.headerBg },
    headerTintColor: appBrand.headerForeground,
    headerTitleStyle: { fontWeight: '700' as const },
    title,
    tabBarActiveTintColor: appBrand.tabActive,
    tabBarInactiveTintColor: appBrand.tabInactive,
    tabBarStyle: {
      backgroundColor: theme.colors.card,
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      height: Platform.OS === 'ios' ? 88 : 64,
      paddingBottom: Platform.OS === 'ios' ? 28 : 10,
      paddingTop: 8,
    },
    tabBarLabelStyle: { fontSize: 12, fontWeight: '600' as const },
    tabBarLabel,
    tabBarIcon: ({
      color,
      focused,
      size,
    }: {
      color: string;
      focused: boolean;
      size: number;
    }) => (
      <TabBarGlyph
        routeName={route.name as MainTabScreenName}
        focused={focused}
        color={color}
        size={size}
        badgeCount={
          route.name === 'Notifications' ? NOTIFICATION_BADGE_COUNT : 0
        }
      />
    ),
  };
}

const mainTabs = createBottomTabNavigator<TabParamList>({
  screenOptions: mainTabsScreenOptions,
  screens: {
    Home: HomeScreen,
    Search: SearchScreen,
    Notifications: NotificationsScreen,
    Profile: ProfileScreen,
  },
});

const drawerIcon =
  (symbol: string) =>
  ({ color, size }: { color: string; size: number }) =>
    (
      <Text style={[drawerIconStyles.base, { color, fontSize: size - 2 }]}>
        {symbol}
      </Text>
    );

function mainTabsDrawerOptions() {
  const t = i18n.t.bind(i18n);
  return {
    ...getDrawerMainTabsOptions(t),
    drawerIcon: drawerIcon('🏠'),
  };
}

function settingsDrawerOptions() {
  const t = i18n.t.bind(i18n);
  return {
    ...getDrawerLeafTranslatedFields(t, 'settings'),
    drawerIcon: drawerIcon('⚙️'),
  };
}

function helpDrawerOptions() {
  const t = i18n.t.bind(i18n);
  return {
    ...getDrawerLeafTranslatedFields(t, 'help'),
    drawerIcon: drawerIcon('❔'),
  };
}

function aboutDrawerOptions() {
  const t = i18n.t.bind(i18n);
  return {
    ...getDrawerLeafTranslatedFields(t, 'about'),
    drawerIcon: drawerIcon('ℹ️'),
  };
}

export const rootNavigator = createDrawerNavigator<DrawerParamList>({
  drawerContent: props => <CustomDrawerContent {...props} />,
  screenOptions: {
    drawerPosition: drawerOpensFromEnd ? 'right' : 'left',
    drawerActiveBackgroundColor: appBrand.drawerActiveBg,
    drawerActiveTintColor: appBrand.drawerActiveTint,
    drawerInactiveTintColor: appBrand.drawerInactiveTint,
    drawerLabelStyle: {
      marginStart: -8,
      fontSize: 16,
      fontWeight: '500' as const,
    },
    drawerItemStyle: {
      borderRadius: 8,
      marginHorizontal: 8,
      marginVertical: 4,
    },
    drawerStyle: {
      width: '78%',
      backgroundColor: '#ffffff',
      ...(drawerOpensFromEnd
        ? { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }
        : { borderTopRightRadius: 20, borderBottomRightRadius: 20 }),
    },
    swipeEnabled: true,
    overlayColor: 'rgba(0,0,0,0.45)',
    keyboardDismissMode: 'on-drag',
  },
  screens: {
    MainTabs: {
      screen: mainTabs,
      options: mainTabsDrawerOptions,
    },
    Settings: {
      screen: SettingsScreen,
      options: settingsDrawerOptions,
    },
    Help: {
      screen: HelpScreen,
      options: helpDrawerOptions,
    },
    About: {
      screen: AboutScreen,
      options: aboutDrawerOptions,
    },
  },
});
