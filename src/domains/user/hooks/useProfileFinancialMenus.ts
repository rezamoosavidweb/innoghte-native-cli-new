import type { TFunction } from 'i18next';
import * as React from 'react';

import type { MenuSectionItem } from '@/ui/components/MenuSection';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';
import PaymentIcon from '@/assets/icons/inn/payment.svg';
import GiftThinIcon from '@/assets/icons/gift.svg';
import { SvgProps } from 'react-native-svg';

type FinancialMenuRowConfig = {
  readonly id: string;
  readonly icon: React.FC<SvgProps>;
  readonly titleKey: 'financialSupport' | 'gift';
  readonly route: AppLeafRouteName;
};

const PROFILE_FINANCIAL_MENU: readonly FinancialMenuRowConfig[] = [
  {
    id: 'financial-support',
    icon: PaymentIcon,
    titleKey: 'financialSupport',
    route: 'FinancialSupport',
  },
  {
    id: 'gift',
    icon: GiftThinIcon,
    titleKey: 'gift',
    route: 'GiftScreen',
  },
] as const;

function mapFinancialMenuConfig(
  rows: readonly FinancialMenuRowConfig[],
  t: TFunction,
): MenuSectionItem[] {
  return rows.map(row => ({
    id: row.id,
    icon: row.icon,
    route: row.route,
    title: t(`screens.profile.financialMenu.${row.titleKey}`),
  }));
}

export function useProfileFinancialMenus(t: TFunction): MenuSectionItem[] {
  return React.useMemo(
    () => mapFinancialMenuConfig(PROFILE_FINANCIAL_MENU, t),
    [t],
  );
}
