import * as React from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { PRESENT_STORAGE_JSON_KEY } from '@/domains/user/model/giveGift.storageKeys';
import { StorageService } from '@/shared/infra/storage/storage.service';

export type GiftPresentState = {
  presentId: string | null;
  giftsCourseIds: number[];
};

const empty: GiftPresentState = { presentId: null, giftsCourseIds: [] };

/**
 * Mirrors client-web `localStorage` key `present`: `{ [presentId]: number[] }`.
 */
export function readGiftPresentFromStorage(): GiftPresentState {
  const raw = StorageService.get<Record<string, number[]>>(PRESENT_STORAGE_JSON_KEY);
  if (!raw || typeof raw !== 'object') {
    return empty;
  }
  const presentId = Object.keys(raw)[0] ?? null;
  const ids = presentId ? raw[presentId] : undefined;
  return {
    presentId,
    giftsCourseIds: Array.isArray(ids) ? ids : [],
  };
}

export function useGiftPresentFromStorage(): GiftPresentState {
  const [state, setState] = React.useState<GiftPresentState>(() =>
    readGiftPresentFromStorage(),
  );

  useFocusEffect(
    React.useCallback(() => {
      setState(readGiftPresentFromStorage());
    }, []),
  );

  return state;
}
