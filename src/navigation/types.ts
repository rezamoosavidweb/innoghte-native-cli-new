import type { NavigatorScreenParams } from '@react-navigation/native';

/** Bottom tabs — primary app sections. */
export type TabParamList = {
  Home: undefined;
  Search: { query?: string };
  Notifications: undefined;
  Profile: { userId?: string } | undefined;
};

/** Root drawer — tabs plus secondary routes (article pattern: drawer wraps tabs). */
export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
};

export type MainTabScreenName = keyof TabParamList;
