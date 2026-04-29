import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import type { Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, Text } from 'react-native';

import { AuthService } from '@/domains/auth';
import { protectedNavigate } from '@/app/bridge/auth/protectedNavigation';
import { AboutScreen } from '@/domains/support/about/screens/AboutScreen';
import { LoginScreen } from '@/domains/auth/screens/LoginScreen';
import { EventsScreen } from '@/domains/events/screens/EventsScreen';
import { FaqsScreen } from '@/domains/support/faqs/screens/FaqsScreen';
import { HelpScreen } from '@/domains/support/help/screens/HelpScreen';
import { HomeScreen, ServicesHubScreen } from '@/domains/home';
import { LegacyMenuPlaceholderScreen } from '@/app/navigation/LegacyMenuPlaceholderScreen';
import { LiveMeetingsScreen } from '@/domains/live/screens/LiveMeetingsScreen';
import { MyCoursesHubScreen, ProfileScreen } from '@/domains/user';
import { PublicAlbumsScreen } from '@/domains/media/screens/PublicAlbumsScreen';
import { SettingsScreen } from '@/domains/settings/screens/SettingsScreen';
import { StartupScreen } from '@/app/startup/StartupScreen';
import { CoursesScreen } from '@/domains/courses/screens/CoursesScreen';
import { CollapsibleHeaderExampleScreen } from '@/app/examples/CollapsibleHeaderExampleScreen';
import { SearchScreen } from '@/domains/search';
import { CustomDrawerContent } from '@/ui/layout/CustomDrawerContent';
import { DrawerMenuButton } from '@/ui/components/DrawerMenuButton';
import { NOTIFICATION_BADGE_COUNT } from '@/domains/user/model/notificationBadge';
import {
  drawerChrome,
  fontWeight,
  mainTabBarLabelStyle,
  mainTabHeaderTitleStyle,
  pickSemantic,
  tabBarSurfaceStyle,
} from '@/ui/theme';
import i18n from '@/shared/infra/i18n';

import { ExperiencesHubScreen } from '@/domains/experiences';
import { isDrawerPhysicalRight } from '@/app/navigation/drawerLayout';
import {
  getDrawerLeafTranslatedFields,
  getDrawerMainTabsOptions,
  getExtraDrawerLeafOptions,
  getTranslatedTabFields,
  type ExtraDrawerLeafKey,
} from '@/app/navigation/i18nScreenOptions';
import { TabBarGlyph } from '@/app/navigation/tabBarConfig';
import type {
  DrawerParamList,
  MainTabScreenName,
  TabParamList,
} from '@/shared/contracts/navigationApp';

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
    // headerShown: false,
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
          if (!AuthService.isAuthenticated()) {
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

function protectedAuthDrawerScreen(
  target: 'MyCourses' | 'LiveMeetings' | 'Events',
) {
  return {
    listeners: (props: {
      navigation: {
        dispatch: (action: { type: string; payload?: object }) => void;
      };
    }) => ({
      drawerItemPress: (e: { preventDefault: () => void }) => {
        if (AuthService.isAuthenticated()) {
          return;
        }
        e.preventDefault();
        protectedNavigate(props.navigation, target);
      },
    }),
  };
}

export const rootNavigator = createDrawerNavigator<DrawerParamList>({
  drawerContent: props => <CustomDrawerContent {...props} />,
  screenOptions: ({ theme }) => {
    const s = pickSemantic(theme.dark);
    return {
      headerStyle: { backgroundColor: s.headerBg },
      headerTintColor: s.headerForeground,
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
    MyCourses: {
      screen: MyCoursesHubScreen,
      options: () => extraLeafOptions('myCourses', '🎓'),
      ...protectedAuthDrawerScreen('MyCourses'),
    },
    PublicCourses: {
      screen: CoursesScreen,
      options: () => extraLeafOptions('publicCourses', '📚'),
    },
    LiveMeetings: {
      screen: LiveMeetingsScreen,
      options: () => extraLeafOptions('liveMeetings', '🌐'),
      ...protectedAuthDrawerScreen('LiveMeetings'),
    },
    Events: {
      screen: EventsScreen,
      options: () => extraLeafOptions('events', '📅'),
      ...protectedAuthDrawerScreen('Events'),
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
    Search: {
      screen: SearchScreen,
      options: () => extraLeafOptions('search', '🔎'),
    },
    CollapsibleHeaderExample: {
      screen: CollapsibleHeaderExampleScreen,
      options: () => extraLeafOptions('collapsibleHeaderExample', '🔝'),
    },
  },
});
