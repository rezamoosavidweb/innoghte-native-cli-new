import { Text } from '@/shared/ui/Text';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { type Theme } from '@react-navigation/native';
import * as React from 'react';

import { useDrawerGlyphStyles } from '@/app/bridge/drawerGlyph.styles';
import { CollapsibleHeaderExampleScreen } from '@/app/examples/CollapsibleHeaderExampleScreen';
import { SplashScreen } from '@/app/splash/SplashScreen';
import {
  AlbumDetailScreen,
  AlbumsScreen,
  PublicAlbumDetailScreen,
} from '@/domains/albums';
import {
  AudioBooksScreen,
  PublicAudioBookDetailScreen,
} from '@/domains/audioBooks';
import {
  AuthEntryScreen,
  ForgetPasswordScreen,
  LoginScreen,
  RegisterScreen,
  VerifyScreen,
} from '@/domains/auth';
import { BasketScreen } from '@/domains/basket';
import { CollaborationScreen } from '@/domains/collaboration';
import { ContactScreen } from '@/domains/contact';
import {
  CourseDetailScreen,
  CoursesScreen,
  PublicCourseDetailScreen,
} from '@/domains/courses';
import { DonationScreen } from '@/domains/donation';
import { EventDetailScreen, EventsScreen } from '@/domains/events';
import {
  ListeningScreen,
  MeditationScreen,
  PodcastScreen,
  ReadingScreen,
  WritingScreen,
} from '@/domains/experiences';
import { PaymentResultScreen } from '@/domains/payment';
import { HomeScreen } from '@/domains/home';
import { CopyrightScreen, TermsScreen } from '@/domains/legal';
import { LiveMeetingsScreen } from '@/domains/live';
import { SearchScreen } from '@/domains/search';
import { SettingsScreen } from '@/domains/settings';
import {
  AboutScreen,
  CreateTicketScreen,
  FaqsScreen,
  HelpScreen,
  PrivateConsultationScreen,
  SupportServicesScreen,
  TicketDetailScreen,
  TicketListScreen,
  TutorialScreen,
} from '@/domains/support';
import { TransactionsScreen } from '@/domains/transactions';
import {
  AccountScreen,
  EditProfileScreen,
  FinancialSupportScreen,
  GiftScreen,
  GiftSubScreen,
  GiveGiftScreen,
  ProfileScreen,
  SecurityScreen,
} from '@/domains/user';
import i18n from '@/shared/infra/i18n';
import {
  createAppHeaderOptions,
  createPurchaseHeaderOptions,
  createPublicHeaderOptions,
  createRootHeaderOptions,
} from '@/app/navigation/appHeaderOptions';
import { CustomDrawerContent } from '@/ui/layout/CustomDrawerContent';
import {
  drawerChrome,
  mainTabBarLabelStyle,
  pickSemantic,
  tabBarSurfaceStyle,
} from '@/ui/theme';

import { cartTabBarIcon } from '@/app/bridge/BasketTabBarIcon';
import {
  ProfileTabBarIcon,
  ProfileTabBarLabel,
} from '@/app/bridge/ProfileTabBar';
import { isDrawerPhysicalRight } from '@/app/navigation/drawerLayout';
import {
  getDrawerLeafTranslatedFields,
  getDrawerMainTabsOptions,
  getExtraDrawerLeafOptions,
  getTranslatedTabFields,
  type ExtraDrawerLeafKey,
} from '@/app/navigation/i18nScreenOptions';
import { TabBarGlyph, type TabBarIconArgs } from '@/app/navigation/tabBarConfig';
import type {
  DrawerParamList,
  MainTabScreenName,
  TabParamList,
} from '@/shared/contracts/navigationApp';
import { ServicesScreen } from '@/domains/services';

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
  const s = useDrawerGlyphStyles(color, size);
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
    ...createRootHeaderOptions(theme),
    lazy: true,
    unmountOnBlur: false,
    title,
    tabBarActiveTintColor: s.tabActive,
    tabBarInactiveTintColor: s.tabInactive,
    tabBarStyle: tabBarSurfaceStyle(theme),
    tabBarLabelStyle: mainTabBarLabelStyle,
  };

  if (route.name === 'Profile') {
    return {
      ...base,
      tabBarLabel: ({ color }: { color: string }) => (
        <ProfileTabBarLabel color={color} />
      ),
      tabBarIcon: ({ color, focused, size }: TabBarIconArgs) => (
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
    tabBarIcon: ({ color, focused, size }: TabBarIconArgs) => (
      <TabBarGlyph
        routeName={route.name as MainTabScreenName}
        focused={focused}
        color={color}
        size={size}
        badgeCount={0}
      />
    ),
  };
}

const mainTabs = createBottomTabNavigator<TabParamList>({
  backBehavior: 'history',
  screenOptions: mainTabsScreenOptions,
  screens: {
    Home: {
      screen: HomeScreen,
      options: { headerShown: false },
    },
    Services: ServicesScreen,
    Cart: BasketScreen,
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
  initialRouteName: 'Splash',
  backBehavior: 'history',
  drawerContent: props => <CustomDrawerContent {...props} />,
  screenOptions: ({ theme }) => {
    const s = pickSemantic(theme);
    return {
      ...createAppHeaderOptions(theme),
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
    Splash: {
      screen: SplashScreen,
      options: () => ({
        headerShown: false,
        drawerItemStyle: { display: 'none' },
        swipeEnabled: false,
      }),
    },
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
    Albums: {
      screen: AlbumsScreen,
      options: ({theme}) => ({
        ...extraLeafOptions('publicAlbums', '🎵'),
        ...createPurchaseHeaderOptions(theme),
      }),
    },
    AudioBooks: {
      screen: AudioBooksScreen,
      options: ({theme}) => ({
        ...extraLeafOptions('audioBooks', '📖'),
        ...createPurchaseHeaderOptions(theme),
      }),
    },
    Courses: {
      screen: CoursesScreen,
      options: ({theme}) => ({
        ...extraLeafOptions('publicCourses', '📚'),
        ...createPurchaseHeaderOptions(theme),
      }),
    },
    LiveMeetings: {
      screen: LiveMeetingsScreen,
      options: ({theme}) => ({
        ...extraLeafOptions('liveMeetings', '🌐'),
        ...createPurchaseHeaderOptions(theme),
      }),
    },
    Events: {
      screen: EventsScreen,
      options: ({theme}) => ({
        ...extraLeafOptions('events', '📅'),
        ...createPurchaseHeaderOptions(theme),
      }),
    },
    Login: {
      screen: LoginScreen,
      options: () => ({
        ...extraLeafOptions('login', '🔑'),
        headerShown: false,
      }),
    },
    AuthEntry: {
      screen: AuthEntryScreen,
      options: () => ({
        ...extraLeafOptions('authEntry', '👤'),
        drawerItemStyle: { display: 'none' },
        headerShown: false,
      }),
    },
    Register: {
      screen: RegisterScreen,
      options: () => ({
        ...extraLeafOptions('register', '📝'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    ForgetPassword: {
      screen: ForgetPasswordScreen,
      options: () => ({
        drawerItemStyle: { display: 'none' },
        headerShown: false,
      }),
    },
    Podcast: {
      screen: PodcastScreen,
      options: () => extraLeafOptions('podcast', '🎙️'),
    },
    Meditation: {
      screen: MeditationScreen,
      options: () => extraLeafOptions('meditation', '🧘'),
    },
    Reading: {
      screen: ReadingScreen,
      options: () => extraLeafOptions('reading', '📖'),
    },
    Listening: {
      screen: ListeningScreen,
      options: () => extraLeafOptions('listening', '🎧'),
    },
    Writing: {
      screen: WritingScreen,
      options: () => extraLeafOptions('writing', '✍️'),
    },
    PrivateConsultation: {
      screen: PrivateConsultationScreen,
      options: () => extraLeafOptions('privateConsultation', '💬'),
    },
    Tutorial: {
      screen: TutorialScreen,
      options: () => extraLeafOptions('tutorial', '▶️'),
    },
    Basket: {
      screen: BasketScreen,
      options: () => extraLeafOptions('basket', '🛒'),
    },
    Donation: {
      screen: DonationScreen,
      options: () => extraLeafOptions('donation', '❤️'),
    },
    PaymentResult: {
      screen: PaymentResultScreen,
      // Gateway redirect: innoghte://payment/result?Authority=…&Status=… → params.
      linking: { path: 'payment/result' },
      options: () => ({
        title: 'نتیجه پرداخت',
        drawerLabel: 'نتیجه پرداخت',
        drawerIcon: drawerIcon('🧾'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    AboutUs: {
      screen: AboutScreen,
      options: () => extraLeafOptions('aboutUs', '🏛️'),
    },
    Contact: {
      screen: ContactScreen,
      options: ({ theme }) => ({
        ...extraLeafOptions('contact', '📧'),
        ...createPublicHeaderOptions(theme),
      }),
    },
    Collaboration: {
      screen: CollaborationScreen,
      options: () => ({
        ...extraLeafOptions('collaboration', '🤝'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    LiveMeetingOverview: {
      screen: LiveMeetingsScreen,
      options: () => extraLeafOptions('liveMeetingOverview', '📡'),
    },
    PublicCourseDetail: {
      screen: PublicCourseDetailScreen,
      options: ({theme}) => ({
        ...extraLeafOptions('publicCourseDetail', '📘'),
        ...createPurchaseHeaderOptions(theme),
        drawerItemStyle: { display: 'none' },
      }),
    },
    PublicEventDetail: {
      screen: EventDetailScreen,
      options: ({theme}) => ({
        ...extraLeafOptions('publicEventDetail', '📅'),
        ...createPurchaseHeaderOptions(theme),
        drawerItemStyle: { display: 'none' },
      }),
    },
    CourseDetail: {
      screen: CourseDetailScreen,
      options: () => ({
        ...extraLeafOptions('coursePlayer', '▶️'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    PublicAlbumDetail: {
      screen: PublicAlbumDetailScreen,
      options: ({theme}) => ({
        ...extraLeafOptions('publicAlbumDetail', '💿'),
        ...createPurchaseHeaderOptions(theme),
        drawerItemStyle: { display: 'none' },
      }),
    },
    AlbumDetail: {
      screen: AlbumDetailScreen,
      options: () => ({
        ...extraLeafOptions('albumDetail', '🎵'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    PublicAudioBookDetail: {
      screen: PublicAudioBookDetailScreen,
      options: ({theme}) => ({
        ...extraLeafOptions('publicAudioBookDetail', '📖'),
        ...createPurchaseHeaderOptions(theme),
        drawerItemStyle: { display: 'none' },
      }),
    },
    AudioBookDetail: {
      screen: CourseDetailScreen,
      options: () => ({
        ...extraLeafOptions('audioBookDetail', '🎧'),
        drawerItemStyle: { display: 'none' },
      }),
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
      screen: TransactionsScreen,
      options: () => ({
        ...extraLeafOptions('purchaseHistory', '🧾'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    SupportServices: {
      screen: SupportServicesScreen,
      options: () => ({
        ...extraLeafOptions('supportServices', '🛠️'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    Terms: {
      screen: TermsScreen,
      options: () => ({
        ...extraLeafOptions('terms', '📜'),
        drawerItemStyle: { display: 'none' },
      }),
    },
    Copyright: {
      screen: CopyrightScreen,
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
