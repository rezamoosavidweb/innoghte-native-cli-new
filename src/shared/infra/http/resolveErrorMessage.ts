import { ApiError } from './apiError';

/**
 * Stable user-visible message resolver for thrown API/errors (handles ApiError payload).
 */
export function resolveErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    const fromPayload = err.payload?.message?.trim();
    if (fromPayload) {
      return fromPayload;
    }
    const msg = err.message.trim();
    return msg.length > 0 ? msg : fallback;
  }
  if (err instanceof Error) {
    const msg = err.message.trim();
    return msg.length > 0 ? msg : fallback;
  }
  return fallback;
}
