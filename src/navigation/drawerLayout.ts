import type { AppLanguage } from '@/bootstrap/readAppLanguage';
import { isRtlLanguage } from '@/utils/i18n-rtl';
import i18n from '@/translations';

function resolvedAppLanguage(): AppLanguage {
  return i18n.language === 'en' ? 'en' : 'fa';
}

/** Drawer panel attaches to the physical end when RTL (same rule as `drawerPosition`). */
export function isDrawerPhysicalRight(): boolean {
  return isRtlLanguage(resolvedAppLanguage());
}
