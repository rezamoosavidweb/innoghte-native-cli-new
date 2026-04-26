import { useQuery } from '@tanstack/react-query';

import { getUser } from '@/domains/auth/api/auth.service';
import { useAuthStore } from '@/domains/auth/model/auth.store';
import { AUTH_USER_QUERY_KEY } from '@/shared/infra/query/queryKeys';

/**
 * User profile for the signed-in session (refetch on focus can be added later).
 */
export function useCurrentUser() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return useQuery({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: getUser,
    enabled: isAuthenticated,
  });
}
