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
  publicAlbums: 'drawer.publicAlbums',
  myCourses: 'drawer.myCourses',
  publicCourses: 'drawer.publicCourses',
  liveMeetings: 'drawer.liveMeetings',
  events: 'drawer.events',
  startup: 'drawer.startup',
  login: 'drawer.login',
  podcast: 'drawer.podcast',
  meditation: 'drawer.meditation',
  reading: 'drawer.reading',
  listening: 'drawer.listening',
  writing: 'drawer.writing',
  privateConsultation: 'drawer.privateConsultation',
  donation: 'drawer.donation',
  aboutUs: 'drawer.aboutUs',
  collaboration: 'drawer.collaboration',
  liveMeetingOverview: 'drawer.liveMeetingOverview',
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
