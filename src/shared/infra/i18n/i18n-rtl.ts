import { I18nManager } from 'react-native';

import type { AppLanguage } from '@/shared/contracts/locale';

export type { AppLanguage };

export function isRtlLanguage(lang: AppLanguage): boolean {
  return lang === 'fa';
}

/**
 * Updates native RTL flags. Layout direction only fully applies after an app restart
 * when the value changes (React Native limitation).
 */
export function applyRtlForLanguage(lang: AppLanguage): void {
  const isRTL = isRtlLanguage(lang);
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(isRTL);
}
