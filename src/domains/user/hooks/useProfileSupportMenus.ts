import type { TFunction } from 'i18next';
import * as React from 'react';

import CopyrightLightIcon from '@/assets/icons/copyright-light.svg';
import DocIcon from '@/assets/icons/inn/doc.svg';
import Doc2Icon from '@/assets/icons/inn/doc2.svg';
import PaymentIcon from '@/assets/icons/inn/payment.svg';
import supportFinancial from '@/assets/icons/inn/support-financial.svg';
import type { ProfileMenuListItem } from '@/domains/user/model/profileMenu.types';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';
import { SvgProps } from 'react-native-svg';

type SupportMenuRowConfig = {
  readonly id: string;
  readonly icon: React.FC<SvgProps>;
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
    icon: DocIcon,
    titleKey: 'support',
    route: 'TicketListScreen',
  },
  {
    id: 'purchase-history',
    icon: PaymentIcon,
    titleKey: 'purchaseHistory',
    route: 'PurchaseHistory',
  },
  {
    id: 'support-services',
    icon: supportFinancial,
    titleKey: 'supportServices',
    route: 'SupportServices',
  },
  {
    id: 'terms',
    icon: Doc2Icon,
    titleKey: 'terms',
    route: 'Terms',
  },
  {
    id: 'copyright',
    icon: CopyrightLightIcon,
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
  return React.useMemo(
    () => mapSupportMenuConfig(PROFILE_SUPPORT_MENU, t),
    [t],
  );
}
