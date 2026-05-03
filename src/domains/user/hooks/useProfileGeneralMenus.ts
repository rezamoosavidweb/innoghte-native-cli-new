import type { TFunction } from 'i18next';
import * as React from 'react';

import type { ProfileMenuListItem } from '@/domains/user/model/profileMenu.types';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';

type GeneralMenuRowConfig = {
  readonly id: string;
  readonly icon: string;
  readonly titleKey: 'account' | 'editProfile' | 'security';
  readonly route: AppLeafRouteName;
};

const PROFILE_GENERAL_MENU: readonly GeneralMenuRowConfig[] = [
  {
    id: 'general-account',
    icon: '💳',
    titleKey: 'account',
    route: 'Account',
  },
  {
    id: 'general-editProfiel',
    icon: '🎁',
    titleKey: 'editProfile',
    route: 'EditProfile',
  },
  {
    id: 'general-security',
    icon: '🎁',
    titleKey: 'security',
    route: 'Security',
  },
] as const;

function mapGeneralMenuConfig(
  rows: readonly GeneralMenuRowConfig[],
  t: TFunction,
): ProfileMenuListItem[] {
  return rows.map(row => ({
    id: row.id,
    icon: row.icon,
    route: row.route,
    title: t(`screens.profile.actions.${row.titleKey}`),
  }));
}

export function useProfileGeneralMenus(t: TFunction): ProfileMenuListItem[] {
  return React.useMemo(
    () => mapGeneralMenuConfig(PROFILE_GENERAL_MENU, t),
    [t],
  );
}
