import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import type { Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, Text } from 'react-native';

import { useAuthStore } from '@/auth/auth.store';
import { AboutScreen } from '@/features/about/screen/AboutScreen';
import { LoginScreen } from '@/features/auth/screen/LoginScreen';
import { EventsScreen } from '@/features/events/screen/EventsScreen';
import { ExampleScreen } from '@/features/example/screen/ExampleScreen';
import { FaqsScreen } from '@/features/faqs/screen/FaqsScreen';
import { HelpScreen } from '@/features/help/screen/HelpScreen';
import { HomeScreen } from '@/features/home/screen/HomeScreen';
import { LegacyMenuPlaceholderScreen } from '@/features/legacyMenu/screen/LegacyMenuPlaceholderScreen';
import { LiveMeetingsScreen } from '@/features/liveMeetings/screen/LiveMeetingsScreen';
import { ProfileScreen } from '@/features/profile/screen/ProfileScreen';
import { PublicAlbumsScreen } from '@/features/publicAlbums/screen/PublicAlbumsScreen';
import { SettingsScreen } from '@/features/settings/screen/SettingsScreen';
import { StartupScreen } from '@/features/startup/screen/StartupScreen';
import { CustomDrawerContent } from '@/shared/components/CustomDrawerContent';
import { DrawerMenuButton } from '@/shared/components/DrawerMenuButton';
import { NOTIFICATION_BADGE_COUNT } from '@/shared/constants/state/notificationBadge';
import {
  drawerChrome,
  fontWeight,
  mainTabBarLabelStyle,
  mainTabHeaderTitleStyle,
  pickSemantic,
  tabBarSurfaceStyle,
} from '@/shared/styles/theme';
import i18n from '@/shared/translations';

import { ExperiencesHubScreen } from '@/features/experiences/screen/ExperiencesHubScreen';
import { ServicesHubScreen } from '@/features/services/screen/ServicessHubScreen';
import { isDrawerPhysicalRight } from '@/shared/navigation/drawerLayout';
import {
  getDrawerLeafTranslatedFields,
  getDrawerMainTabsOptions,
  getExtraDrawerLeafOptions,
  getTranslatedTabFields,
  type ExtraDrawerLeafKey,
} from '@/shared/navigation/i18nScreenOptions';
import { TabBarGlyph } from '@/shared/navigation/tabBarConfig';
import { protectedNavigate } from '@/shared/navigation/protectedNavigation';
import type {
  DrawerParamList,
  MainTabScreenName,
  TabParamList,
} from '@/shared/navigation/types';

const drawerOpensFromEnd = isDrawerPhysicalRight();

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
        glyph: {
          fontWeight: fontWeight.semibold,
          color,
          fontSize: size - 2,
        },
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

function mainTabsScreenOptions({
  route,
  theme,
}: {
  route: { name: string };
  theme: Theme;
}) {
  const t = i18n.t.bind(i18n);
  const { tabBarLabel, title } = getTranslatedTabFields(t, String(route.name));
  const s = pickSemantic(theme.dark);

  return {
    lazy: true,
    unmountOnBlur: false,
    headerLeft: () => <DrawerMenuButton />,
    headerStyle: { backgroundColor: s.headerBg },
    headerTintColor: s.headerForeground,
    headerTitleStyle: mainTabHeaderTitleStyle,
    title,
    tabBarActiveTintColor: s.tabActive,
    tabBarInactiveTintColor: s.tabInactive,
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
    Services: ServicesHubScreen,
    Experiences: ExperiencesHubScreen,
    Home: HomeScreen,
    Faqs: FaqsScreen,
    Profile: {
      screen: ProfileScreen,
      listeners: ({ navigation }) => ({
        tabPress: e => {
          if (!useAuthStore.getState().isAuthenticated) {
            e.preventDefault();
            protectedNavigate(navigation, 'Profile');
          }
        },
      }),
    },
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
  screenOptions: ({ theme }) => {
    const s = pickSemantic(theme.dark);
    return {
      drawerPosition: drawerOpensFromEnd ? 'right' : 'left',
      drawerActiveBackgroundColor: s.drawerActiveBg,
      drawerActiveTintColor: s.drawerActiveTint,
      drawerInactiveTintColor: s.drawerInactiveTint,
      drawerLabelStyle: drawerChrome.drawerLabel,
      drawerItemStyle: drawerChrome.drawerItem,
      drawerStyle: [
        drawerChrome.drawer,
        drawerOpensFromEnd
          ? drawerChrome.radiusFromEnd
          : drawerChrome.radiusFromStart,
      ],
      swipeEnabled: true,
      overlayColor: s.overlay,
      keyboardDismissMode: 'on-drag' as const,
    };
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
    PublicCourses: {
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
