import type { AppLanguage } from '@/shared/contracts/locale';
import { isRtlLanguage } from '@/shared/infra/i18n/i18n-rtl';
import i18n from '@/shared/infra/i18n';

function resolvedAppLanguage(): AppLanguage {
  return i18n.language === 'en' ? 'en' : 'fa';
}

/** Drawer panel attaches to the physical end when RTL (same rule as `drawerPosition`). */
export function isDrawerPhysicalRight(): boolean {
  return isRtlLanguage(resolvedAppLanguage());
}
