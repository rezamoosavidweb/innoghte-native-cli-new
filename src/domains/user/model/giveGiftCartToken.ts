import { GIVE_GIFT_CART_TOKEN_KEY } from '@/domains/user/model/giveGift.storageKeys';
import { StorageService } from '@/shared/infra/storage/storage.service';

export function nextRandomGiftCartSegment(): string {
  const g = globalThis as { crypto?: { randomUUID?: () => string } };
  if (g.crypto && typeof g.crypto.randomUUID === 'function') {
    return g.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function readOrCreateCartToken(): string {
  const existing = StorageService.getString(GIVE_GIFT_CART_TOKEN_KEY);
  if (existing) return existing;
  const next = nextRandomGiftCartSegment();
  StorageService.setString(GIVE_GIFT_CART_TOKEN_KEY, next);
  return next;
}
