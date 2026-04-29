/**
 * Centralized 401 → auth redirect behavior.
 *
 * @example Login without resuming previous route
 * ```ts
 * withKyAuth401Context({ strategy: 'login_only' });
 * ```
 *
 * @example Per-request: resume this screen after login
 * ```ts
 * getApiClient().get(
 *   path,
 *   withKyAuth401Context({ strategy: 'back_to_previous_screen', redirectToLogin: true }),
 * );
 * ```
 *
 * @example Screen default (focused route wins for API calls without their own context)
 * ```tsx
 * const policy = useMemo(
 *   () => ({ strategy: 'back_to_previous_screen' as const, redirectToLogin: true }),
 *   [],
 * );
 * useAuth401ScreenScope(policy);
 * ```
 *
 * @example Per-request: clear session only (no move to Login) — matches global default
 * ```ts
 * getApiClient().get(path, withKyAuth401Context({ strategy: 'no_redirect' }));
 * ```
 *
 * @example TanStack Query: bridge `meta` in queryFn
 * ```ts
 * useQuery({
 *   queryKey,
 *   meta: { auth401: { strategy: 'no_redirect' } },
 *   queryFn: ({ meta }) =>
 *     getApiClient().get(
 *       path,
 *       withKyAuth401Context((meta as { auth401?: Auth401PolicyInput }).auth401 ?? {}),
 *     ),
 * });
 * ```
 */
export type {
  Auth401PolicyInput,
  Auth401RedirectStrategy,
  ResolvedAuth401Policy,
} from '@/shared/infra/auth401/types';
export { resolveAuth401Policy } from '@/shared/infra/auth401/resolvePolicy';
export {
  AUTH401_KY_CONTEXT_KEY,
  readAuth401FromKyContext,
  withKyAuth401Context,
  type Auth401KyContext,
} from '@/shared/infra/auth401/kyContext';
export {
  getGlobalAuth401Defaults,
  setGlobalAuth401Defaults,
} from '@/shared/infra/auth401/globalDefaults';
export { handleKy401Unauthorized, type Ky401UnauthorizedDetail } from '@/shared/infra/auth401/handleKy401';
export { useAuth401ScreenScope } from '@/shared/infra/auth401/useAuth401ScreenScope';
export { pushAuth401ScreenPolicy, getFocusedAuth401ScreenPolicy } from '@/shared/infra/auth401/screenScope';
export {
  captureResumeRouteFromNavigationRef,
  getFocusedLeafRouteFromNavigationRef,
  isOnLoginScreen,
} from '@/shared/infra/auth401/captureRoute';
export {
  queue401PostLogin,
  take401PostLoginHandler,
  peek401PostLoginQueued,
} from '@/shared/infra/auth401/post401LoginQueue';
