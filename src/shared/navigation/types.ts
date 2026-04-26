import type { NavigatorScreenParams } from '@react-navigation/native';

/** Bottom tabs — primary app sections. */
export type TabParamList = {
  Home: undefined;
  // Search: { query?: string };
  Services: undefined;
  Experiences: undefined;
  Faqs: undefined;
  Profile: { userId?: string } | undefined;
};

/** Root drawer — tabs plus secondary routes (article pattern: drawer wraps tabs). */
export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
  PublicAlbums: undefined;
  PublicCourses: undefined;
  LiveMeetings: undefined;
  Events: undefined;
  Example: undefined;
  Startup: undefined;
  Login: undefined;
  Podcast: undefined;
  Meditation: undefined;
  Reading: undefined;
  Listening: undefined;
  Writing: undefined;
  PrivateConsultation: undefined;
  Donation: undefined;
  AboutUs: undefined;
  Collaboration: undefined;
  LiveMeetingOverview: undefined;
};

export type MainTabScreenName = keyof TabParamList;

/** Drawer screens addressable without nesting through `MainTabs`. */
export type DrawerLeafRouteName = Exclude<keyof DrawerParamList, 'MainTabs'>;

/**
 * Any leaf the app can deep-link or protect as a single destination (tabs or drawer).
 */
export type AppLeafRouteName = keyof TabParamList | DrawerLeafRouteName;

export type LeafRouteParams<N extends AppLeafRouteName> = N extends keyof TabParamList
  ? TabParamList[N]
  : N extends DrawerLeafRouteName
    ? DrawerParamList[N]
    : never;
