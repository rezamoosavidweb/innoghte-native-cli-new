import * as React from 'react';

import { queryClient } from '@/app/queryClient';
import { AuthService } from '@/domains/auth';
import { getUserForSplash } from '@/domains/auth/api/auth.service';
import { getAccessToken } from '@/domains/auth/api/auth.storage';

export type AuthBootstrapStatus = 'checking' | 'authenticated' | 'unauthenticated';

/**
 * Runs the startup auth gate exactly once on mount:
 *   1. No token → 'unauthenticated' (skip network)
 *   2. Token present → fetch user profile
 *      - Success → 'authenticated'
 *      - Any failure → clear auth + RQ cache → 'unauthenticated'
 *
 * Uses `getUserForSplash` (no_redirect 401 strategy) so this hook owns all
 * navigation decisions without racing the global 401 handler.
 */
export function useAuthBootstrap(): AuthBootstrapStatus {
  const [status, setStatus] = React.useState<AuthBootstrapStatus>('checking');

  React.useEffect(() => {
    let cancelled = false;

    async function bootstrap(): Promise<void> {
      const token = getAccessToken();

      if (!token) {
        if (!cancelled) setStatus('unauthenticated');
        return;
      }

      try {
        await getUserForSplash();
        if (!cancelled) setStatus('authenticated');
      } catch {
        queryClient.clear();
        AuthService.clearLocalAuth();
        if (!cancelled) setStatus('unauthenticated');
      }
    }

    bootstrap().catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
