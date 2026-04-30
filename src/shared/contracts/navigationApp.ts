import type { NavigatorScreenParams } from '@react-navigation/native';

import type { DonationScreenParams } from '@/shared/contracts/navigationDonation';
import type { VerifyChannel } from './verification';

/** Bottom tabs — primary app sections. */
export type TabParamList = {
  Home: undefined;
  PublicCourses: undefined;
  PublicAlbums: undefined;
  Cart: undefined;
  Profile: { userId?: string } | undefined;
};

/** Root drawer — tabs plus secondary routes (drawer wraps tabs). */
export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  Settings: undefined;
  Account: undefined;
  Security: undefined;
  EditProfile: undefined;
  /** Email / mobile verification (params required when opening). */
  Verify: { type: VerifyChannel };
  Help: undefined;
  /** FAQs content — drawer-only (hidden item); former bottom-tab route. */
  Faqs: undefined;
  About: undefined;
  PublicAlbums: undefined;
  PublicCourses: undefined;
  MyCourses: undefined;
  LiveMeetings: undefined;
  Events: undefined;
  Startup: undefined;
  Login: { redirectTo?: string; preserveState?: boolean } | undefined;
  Basket: { resumeCheckout?: boolean } | undefined;
  Podcast: undefined;
  Meditation: undefined;
  Reading: undefined;
  Listening: undefined;
  Writing: undefined;
  PrivateConsultation: undefined;
  Donation: DonationScreenParams | undefined;
  AboutUs: undefined;
  Collaboration: undefined;
  LiveMeetingOverview: undefined;
  /** Dev / demo drawer route — accepts optional query for SearchScreen subtitle. */
  Search: { query?: string } | undefined;
  /** Demo: collapsible header on scroll. */
  CollapsibleHeaderExample: undefined;
  /** Profile hub — financial & gifts (secondary drawer leaves). */
  FinancialSupport: undefined;
  GiftScreen: undefined;
  GiftSend: undefined;
  GiftReceived: undefined;
  GiftSent: undefined;
  /** Support ticketing & profile legal shortcuts. */
  TicketListScreen: undefined;
  CreateTicketScreen: undefined;
  TicketDetailScreen: { id: number };
  PurchaseHistory: undefined;
  SupportServices: undefined;
  Terms: undefined;
  Copyright: undefined;
};

export type MainTabScreenName = keyof TabParamList;

export type DrawerLeafRouteName = Exclude<keyof DrawerParamList, 'MainTabs'>;

export type AppLeafRouteName = keyof TabParamList | DrawerLeafRouteName;

export type LeafRouteParams<N extends AppLeafRouteName> = N extends keyof TabParamList
  ? TabParamList[N]
  : N extends DrawerLeafRouteName
    ? DrawerParamList[N]
    : never;
