import type { TFunction } from 'i18next';
import * as React from 'react';

import type { ProfileMenuListItem } from '@/domains/user/model/profileMenu.types';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';

type FinancialMenuRowConfig = {
  readonly id: string;
  readonly icon: string;
  readonly titleKey: 'financialSupport' | 'gift';
  readonly route: AppLeafRouteName;
};

const PROFILE_FINANCIAL_MENU: readonly FinancialMenuRowConfig[] = [
  {
    id: 'financial-support',
    icon: '💳',
    titleKey: 'financialSupport',
    route: 'FinancialSupport',
  },
  {
    id: 'gift',
    icon: '🎁',
    titleKey: 'gift',
    route: 'GiftScreen',
  },
] as const;

function mapFinancialMenuConfig(
  rows: readonly FinancialMenuRowConfig[],
  t: TFunction,
): ProfileMenuListItem[] {
  return rows.map(row => ({
    id: row.id,
    icon: row.icon,
    route: row.route,
    title: t(`screens.profile.financialMenu.${row.titleKey}`),
  }));
}

export function useProfileFinancialMenus(t: TFunction): ProfileMenuListItem[] {
  return React.useMemo(() => mapFinancialMenuConfig(PROFILE_FINANCIAL_MENU, t), [
    t,
  ]);
}
