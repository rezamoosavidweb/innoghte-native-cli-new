import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import type { Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, Text } from 'react-native';

import { protectedNavigate } from '@/app/bridge/auth/protectedNavigation';
import { CollapsibleHeaderExampleScreen } from '@/app/examples/CollapsibleHeaderExampleScreen';
import { LegacyMenuPlaceholderScreen } from '@/app/navigation/LegacyMenuPlaceholderScreen';
import { StartupScreen } from '@/app/startup/StartupScreen';
import { AuthService, LoginScreen, VerifyScreen } from '@/domains/auth';
import { CoursesScreen } from '@/domains/courses/screens/CoursesScreen';
import { EventsScreen } from '@/domains/events/screens/EventsScreen';
import { HomeScreen } from '@/domains/home';
import { LiveMeetingsScreen } from '@/domains/live/screens/LiveMeetingsScreen';
import { PublicAlbumsScreen } from '@/domains/media/screens/PublicAlbumsScreen';
import { SearchScreen } from '@/domains/search';
import {
  CreateTicketScreen,
  SupportLegalPlaceholderScreen,
  TicketDetailScreen,
  TicketListScreen,
} from '@/domains/support';
import { SettingsScreen } from '@/domains/settings/screens/SettingsScreen';
import { AboutScreen } from '@/domains/support/about/screens/AboutScreen';
import { FaqsScreen } from '@/domains/support/faqs/screens/FaqsScreen';
import { HelpScreen } from '@/domains/support/help/screens/HelpScreen';
import {
  AccountScreen,
  EditProfileScreen,
  MyCoursesHubScreen,
  ProfileScreen,
  SecurityScreen,
} from '@/domains/user';
import { FinancialSupportScreen } from '@/domains/user/screens/FinancialSupportScreen';
import { GiftScreen } from '@/domains/user/screens/GiftScreen';
import { GiftSubScreen } from '@/domains/user/screens/GiftSubScreen';
import { NOTIFICATION_BADGE_COUNT } from '@/domains/user/model/notificationBadge';
import i18n from '@/shared/infra/i18n';
import { DrawerMenuButton } from '@/ui/components/DrawerMenuButton';
import { CustomDrawerContent } from '@/ui/layout/CustomDrawerContent';
import {
  drawerChrome,
  fontWeight,
  mainTabBarLabelStyle,
  mainTabHeaderTitleStyle,
  pickSemantic,
  tabBarSurfaceStyle,
} from '@/ui/theme';

import { isDrawerPhysicalRight } from '@/app/navigation/drawerLayout';
import {
  getDrawerLeafTranslatedFields,
  getDrawerMainTabsOptions,
  getExtraDrawerLeafOptions,
  getTranslatedTabFields,
  type ExtraDrawerLeafKey,
} from '@/app/navigation/i18nScreenOptions';
import {
  ProfileTabBarIcon,
  ProfileTabBarLabel,
} from '@/app/bridge/ProfileTabBar';
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

  const base = {
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
  } as const;

  if (route.name === 'Profile') {
    return {
      ...base,
      tabBarLabel: ({ color }: { color: string }) => (
        <ProfileTabBarLabel color={color} />
      ),
      tabBarIcon: ({
        color,
        focused,
        size,
      }: {
        color: string;
        focused: boolean;
        size: number;
      }) => (
        <ProfileTabBarIcon color={color} focused={focused} size={size} />
      ),
    };
  }

  return {
    ...base,
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
    PublicCourses: CoursesScreen,
    PublicAlbums: PublicAlbumsScreen,
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
    Account: {
      screen: AccountScreen,
      options: () => ({
        ...extraLeafOptions('account', '👤'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    Security: {
      screen: SecurityScreen,
      options: () => ({
        ...extraLeafOptions('security', '🔒'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    EditProfile: {
      screen: EditProfileScreen,
      options: () => ({
        ...extraLeafOptions('editProfile', '✏️'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    Verify: {
      screen: VerifyScreen,
      options: () => ({
        ...extraLeafOptions('verify', '✉️'),
        drawerItemStyle: { display: 'none' },
      }),
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
    FinancialSupport: {
      screen: FinancialSupportScreen,
      options: () => ({
        ...extraLeafOptions('financialSupport', '💳'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    GiftScreen: {
      screen: GiftScreen,
      options: () => ({
        ...extraLeafOptions('giftScreen', '🎁'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    GiftSend: {
      screen: GiftSubScreen,
      options: () => ({
        ...extraLeafOptions('giftSend', '📤'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    GiftReceived: {
      screen: GiftSubScreen,
      options: () => ({
        ...extraLeafOptions('giftReceived', '📥'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    GiftSent: {
      screen: GiftSubScreen,
      options: () => ({
        ...extraLeafOptions('giftSent', '📒'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    TicketListScreen: {
      screen: TicketListScreen,
      options: () => ({
        ...extraLeafOptions('ticketListScreen', '🎫'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    CreateTicketScreen: {
      screen: CreateTicketScreen,
      options: () => ({
        ...extraLeafOptions('createTicketScreen', '✏️'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    TicketDetailScreen: {
      screen: TicketDetailScreen,
      options: () => ({
        ...extraLeafOptions('ticketDetailScreen', '💬'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    PurchaseHistory: {
      screen: SupportLegalPlaceholderScreen,
      options: () => ({
        ...extraLeafOptions('purchaseHistory', '🧾'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    SupportServices: {
      screen: SupportLegalPlaceholderScreen,
      options: () => ({
        ...extraLeafOptions('supportServices', '🛠️'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    Terms: {
      screen: SupportLegalPlaceholderScreen,
      options: () => ({
        ...extraLeafOptions('terms', '📜'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    Copyright: {
      screen: SupportLegalPlaceholderScreen,
      options: () => ({
        ...extraLeafOptions('copyright', '©️'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    CollapsibleHeaderExample: {
      screen: CollapsibleHeaderExampleScreen,
      options: () => extraLeafOptions('collapsibleHeaderExample', '🔝'),
    },
  },
});
