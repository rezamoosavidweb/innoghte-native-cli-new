import type { PendingNavigation } from '@/domains/auth';

/** How to resume after the user signs in again following a 401. */
export type Auth401RedirectStrategy =
  | 'back_to_previous_screen'
  | 'force_specific_route'
  /** Clear session only — no navigation to Login (errors still flow to `onApiError`). */
  | 'no_redirect'
  /**
   * Navigate to Login but do not capture a resume route; after login, `completePendingAuthNavigation`
   * falls through to Home unless another flow set `pendingNavigation`.
   */
  | 'login_only'
  | 'custom_route_function';

/**
 * Partial policy attached from global defaults, screen scope, or ky `context.auth401`.
 * Later layers override earlier ones field-by-field (request → screen → global).
 */
export type Auth401PolicyInput = {
  redirectToLogin?: boolean;
  strategy?: Auth401RedirectStrategy;
  /** Required when strategy is `force_specific_route`. */
  forcedTarget?: PendingNavigation;
  /**
   * When strategy is `custom_route_function`, run this instead of the default
   * pending-navigation resume inside `completePendingAuthNavigation`.
   */
  customPostLogin?: () => void;
};

export type ResolvedAuth401Policy = {
  redirectToLogin: boolean;
  strategy: Auth401RedirectStrategy;
  forcedTarget?: PendingNavigation;
  customPostLogin?: () => void;
};
