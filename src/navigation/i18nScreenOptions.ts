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
