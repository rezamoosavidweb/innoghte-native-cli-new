import { ZUSTAND_AUTH_PERSIST_KEY } from '@/domains/auth/model/authPersistKey';
import { useAuthStore } from '@/domains/auth/model/auth.store';
import { zustandMMKVStorage } from '@/shared/infra/storage/zustand-mmkv-storage';

/**
 * Reads the bearer token for {@link getApiClient} (secure MMKV via Zustand only).
 * Before Zustand rehydrates, falls back to parsing the persisted JSON for the same key.
 */
function readTokenFromPersistedZustand(): string | null {
  const raw = zustandMMKVStorage.getItem(ZUSTAND_AUTH_PERSIST_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as { state?: { accessToken?: string | null } };
    const t = parsed.state?.accessToken;
    return typeof t === 'string' && t.length > 0 ? t : null;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken ?? readTokenFromPersistedZustand();
}
