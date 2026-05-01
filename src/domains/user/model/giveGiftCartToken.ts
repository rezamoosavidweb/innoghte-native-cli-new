import { GIVE_GIFT_CART_TOKEN_KEY } from '@/domains/user/model/giveGift.storageKeys';
import { StorageService } from '@/shared/infra/storage/storage.service';

const LOG = '[GiveGift:cartToken]';

/** Backend `cart_token` is a UUID column; values like `timestamp-hex` are rejected. */
const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function randomUUIDPolyfill(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });
}

export function nextRandomGiftCartSegment(): string {
  const g = globalThis as { crypto?: { randomUUID?: () => string } };
  if (g.crypto && typeof g.crypto.randomUUID === 'function') {
    return g.crypto.randomUUID();
  }
  if (__DEV__) {
    console.warn(LOG, 'crypto.randomUUID unavailable — using polyfill');
  }
  return randomUUIDPolyfill();
}

export function readOrCreateCartToken(): string {
  const raw = StorageService.getString(GIVE_GIFT_CART_TOKEN_KEY);
  const existing = typeof raw === 'string' ? raw.trim() : '';
  if (existing && UUID_V4_RE.test(existing)) {
    return existing;
  }
  if (existing) {
    console.warn(LOG, 'stored token is not UUID v4 — replacing', { preview: `${existing.slice(0, 12)}…` });
  }
  const next = nextRandomGiftCartSegment();
  StorageService.setString(GIVE_GIFT_CART_TOKEN_KEY, next);
  return next;
}
