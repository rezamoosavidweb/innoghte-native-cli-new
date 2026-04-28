import { ApiError } from '@/shared/infra/http/apiError';

export type ApiErrorListener = (error: ApiError | Error) => void;

const listeners = new Set<ApiErrorListener>();

/**
 * Subscribe to every API error reported by the HTTP client.
 * Returns an unsubscribe function. Use from UI shells / toast layers.
 */
export function subscribeToApiErrors(listener: ApiErrorListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Single funnel for every error normalized in the HTTP client `beforeError`
 * hook. Call sites must NOT swallow API errors silently — let them propagate
 * to Ky / React Query so this handler fires once per failure.
 */
export function reportApiError(error: ApiError | Error): void {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    if (error instanceof ApiError) {
      console.warn(
        `[ApiError] ${error.status} ${error.message}`,
        error.payload ?? '',
      );
    } else {
      console.warn('[ApiError]', error);
    }
  }
  for (const listener of listeners) {
    try {
      listener(error);
    } catch {
      // Listener errors must not break the error pipeline.
    }
  }
}

/**
 * Explicit fire-and-forget helper for fire-and-forget API calls. Errors are
 * routed through `reportApiError` via the HTTP client; this helper just makes
 * the intent visible at the call site (no silent `.catch(() => {})`).
 */
export function fireAndForget(promise: Promise<unknown>): void {
  promise.catch(() => {
    // Already reported via the global onApiError pipeline.
  });
}
