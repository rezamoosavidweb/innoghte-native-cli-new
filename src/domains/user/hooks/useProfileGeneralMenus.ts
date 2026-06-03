import type { TFunction } from 'i18next';
import * as React from 'react';
import PaymentRegularIcon from '@/assets/icons/inn/payment.svg';
import EditUserIcon from '@/assets/icons/inn/user.svg';
import ShieldThinIcon from '@/assets/icons/inn/shield.svg';
import type { MenuSectionItem } from '@/ui/components/MenuSection';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';
import { SvgProps } from 'react-native-svg';

type GeneralMenuRowConfig = {
  readonly id: string;
  readonly icon: React.FC<SvgProps>;
  readonly titleKey: 'account' | 'editProfile' | 'security';
  readonly route: AppLeafRouteName;
};

const PROFILE_GENERAL_MENU: readonly GeneralMenuRowConfig[] = [
  {
    id: 'general-account',
    icon: PaymentRegularIcon,
    titleKey: 'account',
    route: 'Account',
  },
  {
    id: 'general-editProfile',
    icon: EditUserIcon,
    titleKey: 'editProfile',
    route: 'EditProfile',
  },
  {
    id: 'general-security',
    icon: ShieldThinIcon,
    titleKey: 'security',
    route: 'Security',
  },
] as const;

function mapGeneralMenuConfig(
  rows: readonly GeneralMenuRowConfig[],
  t: TFunction,
): MenuSectionItem[] {
  return rows.map(row => ({
    id: row.id,
    icon: row.icon,
    route: row.route,
    title: t(`screens.profile.actions.${row.titleKey}`),
  }));
}

export function useProfileGeneralMenus(t: TFunction): MenuSectionItem[] {
  return React.useMemo(
    () => mapGeneralMenuConfig(PROFILE_GENERAL_MENU, t),
    [t],
  );
}
