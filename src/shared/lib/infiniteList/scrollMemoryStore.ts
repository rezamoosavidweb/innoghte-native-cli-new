/** In-memory scroll offsets per route key — bounded LRU to avoid slow growth in long sessions. */

const MAX_KEYS = 30;

const offsetsByKey = new Map<string, number>();

function evictOldest(): void {
  while (offsetsByKey.size > MAX_KEYS) {
    const oldest = offsetsByKey.keys().next().value;
    if (oldest === undefined) {
      break;
    }
    offsetsByKey.delete(oldest);
  }
}

/** Move existing key to LRU “newest” position. */
function promoteKey(key: string): void {
  const v = offsetsByKey.get(key);
  if (v === undefined) {
    return;
  }
  offsetsByKey.delete(key);
  offsetsByKey.set(key, v);
}

export function readScrollOffset(key: string): number | undefined {
  const v = offsetsByKey.get(key);
  if (v === undefined) {
    return undefined;
  }
  promoteKey(key);
  return v;
}

export function writeScrollOffset(key: string, offset: number): void {
  if (!Number.isFinite(offset) || offset < 0) {
    return;
  }
  offsetsByKey.delete(key);
  offsetsByKey.set(key, offset);
  evictOldest();
}

export function clearScrollOffset(key: string): void {
  offsetsByKey.delete(key);
}
