import type { TFunction } from 'i18next';

/** Keeps tab `title` / `tabBarLabel` in sync with i18n without `useTranslation` in navigators. */
export function getTranslatedTabFields(t: TFunction, routeName: string) {
  const key = `tabs.${routeName.toLowerCase()}`;
  const label = t(key);
  return { tabBarLabel: label, title: label } as const;
}

export function getDrawerMainTabsOptions(t: TFunction) {
  return {
    headerShown: false,
    title: t('drawer.home'),
    drawerLabel: t('drawer.home'),
  } as const;
}

export function getDrawerLeafTranslatedFields(
  t: TFunction,
  drawerKey: 'settings' | 'help' | 'about',
) {
  const map = {
    settings: 'drawer.settings',
    help: 'drawer.help',
    about: 'drawer.about',
  } as const;

  const title = t(map[drawerKey]);

  return {
    headerShown: true as const,
    title,
    drawerLabel: title,
  } as const;
}

const EXTRA_DRAWER_LABELS = {
  account: 'drawer.account',
  security: 'drawer.security',
  editProfile: 'drawer.editProfile',
  verify: 'drawer.verify',
  publicAlbums: 'drawer.publicAlbums',
  myCourses: 'drawer.myCourses',
  publicCourses: 'drawer.publicCourses',
  liveMeetings: 'drawer.liveMeetings',
  events: 'drawer.events',
  login: 'drawer.login',
  podcast: 'drawer.podcast',
  meditation: 'drawer.meditation',
  reading: 'drawer.reading',
  listening: 'drawer.listening',
  writing: 'drawer.writing',
  privateConsultation: 'drawer.privateConsultation',
  donation: 'drawer.donation',
  basket: 'drawer.basket',
  aboutUs: 'drawer.aboutUs',
  contact: 'drawer.contact',
  collaboration: 'drawer.collaboration',
  liveMeetingOverview: 'drawer.liveMeetingOverview',
  search: 'drawer.search',
  collapsibleHeaderExample: 'drawer.collapsibleHeaderExample',
  financialSupport: 'drawer.financialSupport',
  giftScreen: 'drawer.giftScreen',
  giftSend: 'drawer.giftSend',
  giftReceived: 'drawer.giftReceived',
  giftSent: 'drawer.giftSent',
  ticketListScreen: 'drawer.ticketListScreen',
  createTicketScreen: 'drawer.createTicketScreen',
  ticketDetailScreen: 'drawer.ticketDetailScreen',
  purchaseHistory: 'drawer.purchaseHistory',
  supportServices: 'drawer.supportServices',
  terms: 'drawer.terms',
  copyright: 'drawer.copyright',
  publicCourseDetail: 'drawer.publicCourseDetail',
  coursePlayer: 'drawer.coursePlayer',
  publicAlbumDetail: 'drawer.publicAlbumDetail',
  albumDetail: 'drawer.albumDetail',
  authEntry: 'drawer.authEntry',
  register: 'drawer.register',
} as const;

export type ExtraDrawerLeafKey = keyof typeof EXTRA_DRAWER_LABELS;

export function getExtraDrawerLeafOptions(
  t: TFunction,
  leaf: ExtraDrawerLeafKey,
) {
  const title = t(EXTRA_DRAWER_LABELS[leaf]);
  return {
    headerShown: true as const,
    title,
    drawerLabel: title,
  } as const;
}
