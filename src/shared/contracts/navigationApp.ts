import type { NavigatorScreenParams } from '@react-navigation/native';

/** Bottom tabs — primary app sections. */
export type TabParamList = {
  Home: undefined;
  Services: undefined;
  Experiences: undefined;
  Faqs: undefined;
  Profile: { userId?: string } | undefined;
};

/** Root drawer — tabs plus secondary routes (drawer wraps tabs). */
export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
  PublicAlbums: undefined;
  PublicCourses: undefined;
  MyCourses: undefined;
  LiveMeetings: undefined;
  Events: undefined;
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

export type DrawerLeafRouteName = Exclude<keyof DrawerParamList, 'MainTabs'>;

export type AppLeafRouteName = keyof TabParamList | DrawerLeafRouteName;

export type LeafRouteParams<N extends AppLeafRouteName> = N extends keyof TabParamList
  ? TabParamList[N]
  : N extends DrawerLeafRouteName
    ? DrawerParamList[N]
    : never;
