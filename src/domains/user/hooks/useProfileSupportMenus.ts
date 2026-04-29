import type { TFunction } from 'i18next';
import * as React from 'react';

import type { ProfileMenuListItem } from '@/domains/user/model/profileMenu.types';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';

type SupportMenuRowConfig = {
  readonly id: string;
  readonly icon: string;
  readonly titleKey:
    | 'support'
    | 'purchaseHistory'
    | 'supportServices'
    | 'terms'
    | 'copyright';
  readonly route: AppLeafRouteName;
};

const PROFILE_SUPPORT_MENU: readonly SupportMenuRowConfig[] = [
  {
    id: 'support-tickets',
    icon: '🎫',
    titleKey: 'support',
    route: 'TicketListScreen',
  },
  {
    id: 'purchase-history',
    icon: '🧾',
    titleKey: 'purchaseHistory',
    route: 'PurchaseHistory',
  },
  {
    id: 'support-services',
    icon: '🛟',
    titleKey: 'supportServices',
    route: 'SupportServices',
  },
  {
    id: 'terms',
    icon: '📜',
    titleKey: 'terms',
    route: 'Terms',
  },
  {
    id: 'copyright',
    icon: '©️',
    titleKey: 'copyright',
    route: 'Copyright',
  },
] as const;

function mapSupportMenuConfig(
  rows: readonly SupportMenuRowConfig[],
  t: TFunction,
): ProfileMenuListItem[] {
  return rows.map(row => ({
    id: row.id,
    icon: row.icon,
    route: row.route,
    title: t(`screens.profile.supportMenu.${row.titleKey}`),
  }));
}

export function useProfileSupportMenus(t: TFunction): ProfileMenuListItem[] {
  return React.useMemo(() => mapSupportMenuConfig(PROFILE_SUPPORT_MENU, t), [t]);
}
