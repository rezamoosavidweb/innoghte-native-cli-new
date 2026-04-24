import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Platform, StyleSheet, Text } from 'react-native';

import type { AppLanguage } from '../bootstrap/readAppLanguage';
import { isRtlLanguage } from '../utils/i18n-rtl';

import { CustomDrawerContent } from '../components/CustomDrawerContent';
import { DrawerMenuButton } from '../components/DrawerMenuButton';
import { AboutScreen } from '../screens/AboutScreen';
import { AlbumsScreen } from '../screens/AlbumsScreen';
import { CoursesScreen } from '../screens/CoursesScreen';
import { EventsScreen } from '../screens/EventsScreen';
import { ExampleScreen } from '../screens/ExampleScreen';
import { FaqsScreen } from '../screens/FaqsScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LegacyMenuPlaceholderScreen } from '../screens/LegacyMenuPlaceholderScreen';
import { LiveMeetingsScreen } from '../screens/LiveMeetingsScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { MyCoursesHubScreen } from '../screens/MyCoursesHubScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { PublicAlbumsScreen } from '../screens/PublicAlbumsScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StartupScreen } from '../screens/StartupScreen';
import { NOTIFICATION_BADGE_COUNT } from '../state/notificationBadge';
import { appBrand } from '../theme/navigationTheme';
import i18n from '../translations';

import {
  getDrawerLeafTranslatedFields,
  getDrawerMainTabsOptions,
  getExtraDrawerLeafOptions,
  getTranslatedTabFields,
  type ExtraDrawerLeafKey,
} from './i18nScreenOptions';
import { TabBarGlyph } from './tabBarConfig';
import type { DrawerParamList, MainTabScreenName, TabParamList } from './types';

function resolvedAppLanguage(): AppLanguage {
  return i18n.language === 'en' ? 'en' : 'fa';
}

const drawerOpensFromEnd = isRtlLanguage(resolvedAppLanguage());

const mainTabHeaderStyle = StyleSheet.create({
  bar: { backgroundColor: appBrand.headerBg },
}).bar;

const mainTabHeaderTitleStyle = StyleSheet.create({
  title: { fontWeight: '700' as const },
}).title;

const mainTabBarLabelStyle = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '600' as const },
}).label;

function tabBarSurfaceStyle(theme: {
  colors: { card: string; border: string };
}) {
  return StyleSheet.create({
    tabBar: {
      backgroundColor: theme.colors.card,
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      height: Platform.OS === 'ios' ? 88 : 64,
      paddingBottom: Platform.OS === 'ios' ? 28 : 10,
      paddingTop: 8,
    },
  }).tabBar;
}

const DrawerGlyph = React.memo(function DrawerGlyph({
  symbol,
  color,
  size,
}: {
  symbol: string;
  color: string;
  size: number;
}) {
  const s = React.useMemo(
    () =>
      StyleSheet.create({
        glyph: { fontWeight: '600' as const, color, fontSize: size - 2 },
      }),
    [color, size],
  );
  return <Text style={s.glyph}>{symbol}</Text>;
});
DrawerGlyph.displayName = 'DrawerGlyph';

const drawerIcon =
  (symbol: string) =>
  ({ color, size }: { color: string; size: number }) =>
    <DrawerGlyph symbol={symbol} color={color} size={size} />;

const drawerChrome = StyleSheet.create({
  drawer: {
    width: '78%',
    backgroundColor: '#ffffff',
  },
  radiusFromEnd: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  radiusFromStart: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  drawerLabel: {
    marginStart: -8,
    fontSize: 16,
    fontWeight: '500' as const,
  },
  drawerItem: {
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
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
    headerStyle: mainTabHeaderStyle,
    headerTintColor: appBrand.headerForeground,
    headerTitleStyle: mainTabHeaderTitleStyle,
    title,
    tabBarActiveTintColor: appBrand.tabActive,
    tabBarInactiveTintColor: appBrand.tabInactive,
    tabBarStyle: tabBarSurfaceStyle(theme),
    tabBarLabelStyle: mainTabBarLabelStyle,
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
    MyCourses: MyCoursesHubScreen,
    Search: SearchScreen,
    Courses: CoursesScreen,
    Albums: AlbumsScreen,
    Faqs: FaqsScreen,
    Notifications: NotificationsScreen,
    Profile: ProfileScreen,
  },
});

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

function extraLeafOptions(leaf: ExtraDrawerLeafKey, icon: string) {
  const t = i18n.t.bind(i18n);
  return {
    ...getExtraDrawerLeafOptions(t, leaf),
    drawerIcon: drawerIcon(icon),
  };
}

export const rootNavigator = createDrawerNavigator<DrawerParamList>({
  drawerContent: props => <CustomDrawerContent {...props} />,
  screenOptions: {
    drawerPosition: drawerOpensFromEnd ? 'right' : 'left',
    drawerActiveBackgroundColor: appBrand.drawerActiveBg,
    drawerActiveTintColor: appBrand.drawerActiveTint,
    drawerInactiveTintColor: appBrand.drawerInactiveTint,
    drawerLabelStyle: drawerChrome.drawerLabel,
    drawerItemStyle: drawerChrome.drawerItem,
    drawerStyle: [
      drawerChrome.drawer,
      drawerOpensFromEnd
        ? drawerChrome.radiusFromEnd
        : drawerChrome.radiusFromStart,
    ],
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
    PublicAlbums: {
      screen: PublicAlbumsScreen,
      options: () => extraLeafOptions('publicAlbums', '🎵'),
    },
    LiveMeetings: {
      screen: LiveMeetingsScreen,
      options: () => extraLeafOptions('liveMeetings', '🌐'),
    },
    Events: {
      screen: EventsScreen,
      options: () => extraLeafOptions('events', '📅'),
    },
    Example: {
      screen: ExampleScreen,
      options: () => extraLeafOptions('example', '🧪'),
    },
    Startup: {
      screen: StartupScreen,
      options: () => extraLeafOptions('startup', '🚀'),
    },
    Login: {
      screen: LoginScreen,
      options: () => extraLeafOptions('login', '🔑'),
    },
    Podcast: {
      screen: LegacyMenuPlaceholderScreen,
      options: () => extraLeafOptions('podcast', '🎙️'),
    },
    Meditation: {
      screen: LegacyMenuPlaceholderScreen,
      options: () => extraLeafOptions('meditation', '🧘'),
    },
    Reading: {
      screen: LegacyMenuPlaceholderScreen,
      options: () => extraLeafOptions('reading', '📖'),
    },
    Listening: {
      screen: LegacyMenuPlaceholderScreen,
      options: () => extraLeafOptions('listening', '🎧'),
    },
    Writing: {
      screen: LegacyMenuPlaceholderScreen,
      options: () => extraLeafOptions('writing', '✍️'),
    },
    PrivateConsultation: {
      screen: LegacyMenuPlaceholderScreen,
      options: () => extraLeafOptions('privateConsultation', '💬'),
    },
    Donation: {
      screen: LegacyMenuPlaceholderScreen,
      options: () => extraLeafOptions('donation', '❤️'),
    },
    AboutUs: {
      screen: LegacyMenuPlaceholderScreen,
      options: () => extraLeafOptions('aboutUs', '🏛️'),
    },
    Collaboration: {
      screen: LegacyMenuPlaceholderScreen,
      options: () => extraLeafOptions('collaboration', '🤝'),
    },
    LiveMeetingOverview: {
      screen: LegacyMenuPlaceholderScreen,
      options: () => extraLeafOptions('liveMeetingOverview', '📡'),
    },
  },
});
