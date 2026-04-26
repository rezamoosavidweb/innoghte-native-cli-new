type RawListResponse<T> = {
  data?: T;
};

/**
 * Unwraps list payloads that may be returned as a bare array or `{ data: T[] }`.
 */
export function normalizeListResponse<T>(result: T[] | RawListResponse<T[]>): T[] {
  if (Array.isArray(result)) {
    return result;
  }
  return result.data ?? [];
}
