import type { NavigatorScreenParams } from '@react-navigation/native';

/** Bottom tabs — primary app sections. */
export type TabParamList = {
  Home: undefined;
  MyCourses: undefined;
  Search: { query?: string };
  Courses: undefined;
  Albums: undefined;
  Faqs: undefined;
  Notifications: undefined;
  Profile: { userId?: string } | undefined;
};

/** Root drawer — tabs plus secondary routes (article pattern: drawer wraps tabs). */
export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
  PublicAlbums: undefined;
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
