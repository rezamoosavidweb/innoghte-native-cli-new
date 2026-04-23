import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import type { AppLanguage } from '../bootstrap/readAppLanguage';

import en from './en.json';
import fa from './fa.json';

const resources = {
  en: { translation: en },
  fa: { translation: fa },
} as const;

/**
 * Initializes the shared i18next instance once, then keeps `lng` in sync.
 * Called from `index.js` bootstrap before `App` is registered.
 */
export async function initI18n(lng: AppLanguage): Promise<typeof i18n> {
  if (i18n.isInitialized) {
    await i18n.changeLanguage(lng);
    return i18n;
  }

  await i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: 'en',
    defaultNS: 'translation',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
  });

  return i18n;
}

export { i18n };
export default i18n;
