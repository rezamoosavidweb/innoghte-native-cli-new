import { useQuery } from '@tanstack/react-query';

import { getUser } from '@/domains/auth/api/auth.service';
import { getAccessToken } from '@/domains/auth/api/auth.storage';
import { useAuthStore } from '@/domains/auth/model/auth.store';
import { AUTH_USER_QUERY_KEY } from '@/domains/auth/model/queryKeys';

/**
 * User profile for the signed-in session. Fetches when a bearer token exists (including cold start — see below).
 *
 * **Why not `useAuthStore(s => s.isAuthenticated)` alone?**
 * Persisted auth rehydrates from MMKV asynchronously. Until then Zustand may still expose the *initial*
 * `isAuthenticated: false` / `accessToken: null` even though `@/domains/auth/api/auth.storage` can already
 * read the token from disk (same source the HTTP client uses). That left `enabled: false` and masked `data`,
 * so `userRes` stayed `undefined` after login / on app reopen.
 *
 * Omits cached `data` once there is no session token (logout / 401) so stale profile is not shown.
 *
 * **`data` is `undefined` while the request is in flight** (and on error) — that is normal TanStack Query behavior;
 * use `isPending` / `isError`, not `data === undefined` alone, to tell loading from failure.
 */
export function useCurrentUser() {
  const accessToken = useAuthStore(s => s.accessToken);
  const hasSession = Boolean(accessToken) || Boolean(getAccessToken());

  const query = useQuery({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: getUser,
    enabled: hasSession,
  });

  return {
    ...query,
    data: hasSession ? query.data : undefined,
  };
}
