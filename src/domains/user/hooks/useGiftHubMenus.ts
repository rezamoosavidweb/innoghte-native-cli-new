import type { TFunction } from 'i18next';
import * as React from 'react';

import type { ProfileMenuListItem } from '@/domains/user/model/profileMenu.types';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';

type GiftHubMenuRowConfig = {
  readonly id: string;
  readonly icon: string;
  readonly titleKey: 'sendGift' | 'receivedGifts' | 'sentGifts';
  readonly route: AppLeafRouteName;
};

const GIFT_HUB_MENU: readonly GiftHubMenuRowConfig[] = [
  {
    id: 'gift-send',
    icon: '📤',
    titleKey: 'sendGift',
    route: 'GiftSend',
  },
  {
    id: 'gift-received',
    icon: '📥',
    titleKey: 'receivedGifts',
    route: 'GiftReceived',
  },
  {
    id: 'gift-sent',
    icon: '📋',
    titleKey: 'sentGifts',
    route: 'GiftSent',
  },
] as const;

function mapGiftHubMenu(
  rows: readonly GiftHubMenuRowConfig[],
  t: TFunction,
): ProfileMenuListItem[] {
  return rows.map(row => ({
    id: row.id,
    icon: row.icon,
    route: row.route,
    title: t(`screens.gift.hub.${row.titleKey}`),
  }));
}

export function useGiftHubMenus(t: TFunction): ProfileMenuListItem[] {
  return React.useMemo(() => mapGiftHubMenu(GIFT_HUB_MENU, t), [t]);
}
