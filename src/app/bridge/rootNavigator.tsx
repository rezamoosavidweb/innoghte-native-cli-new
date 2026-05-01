import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import type { Theme } from '@react-navigation/native';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { protectedNavigate } from '@/app/bridge/auth/protectedNavigation';
import { CollapsibleHeaderExampleScreen } from '@/app/examples/CollapsibleHeaderExampleScreen';
import { LegacyMenuPlaceholderScreen } from '@/app/navigation/LegacyMenuPlaceholderScreen';
import { StartupScreen } from '@/app/startup/StartupScreen';
import { AuthService, LoginScreen, VerifyScreen } from '@/domains/auth';
import { CoursesScreen } from '@/domains/courses';
import { EventsScreen } from '@/domains/events';
import { HomeScreen } from '@/domains/home';
import { LiveMeetingsScreen } from '@/domains/live';
import { PublicAlbumsScreen } from '@/domains/media';
import { SearchScreen } from '@/domains/search';
import {
  AboutScreen,
  CreateTicketScreen,
  FaqsScreen,
  HelpScreen,
  SupportLegalPlaceholderScreen,
  TicketDetailScreen,
  TicketListScreen,
} from '@/domains/support';
import { SettingsScreen } from '@/domains/settings';
import { BasketScreen } from '@/domains/basket';
import { DonationScreen } from '@/domains/donation';
import {
  AccountScreen,
  EditProfileScreen,
  FinancialSupportScreen,
  GiftScreen,
  GiveGiftScreen,
  GiftSubScreen,
  MyCoursesHubScreen,
  NOTIFICATION_BADGE_COUNT,
  ProfileScreen,
  SecurityScreen,
} from '@/domains/user';
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
import { cartTabBarIcon } from '@/app/bridge/BasketTabBarIcon';
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
  const s = pickSemantic(theme);

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

  if (route.name === 'Cart') {
    return {
      ...base,
      tabBarLabel,
      tabBarIcon: cartTabBarIcon,
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
    Home: {
      screen: HomeScreen,
      options: { headerShown: false },
    },
    PublicCourses: CoursesScreen,
    PublicAlbums: PublicAlbumsScreen,
    Cart: BasketScreen,
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
    const s = pickSemantic(theme);
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
    Faqs: {
      screen: FaqsScreen,
      options: () => {
        const t = i18n.t.bind(i18n);
        return {
          headerShown: true as const,
          title: t('tabs.faqs'),
          drawerLabel: t('tabs.faqs'),
          drawerItemStyle: { display: 'none' },
          drawerIcon: drawerIcon('❔'),
        };
      },
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
      options: () => ({
        ...extraLeafOptions('startup', '🚀'),
        headerShown: false,
      }),
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
    Basket: {
      screen: BasketScreen,
      options: () => extraLeafOptions('basket', '🛒'),
    },
    Donation: {
      screen: DonationScreen,
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
      screen: GiveGiftScreen,
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
