/**
 * React Query key factory for the home domain. Use the helper methods —
 * never inline arrays at call sites.
 */
export const homeKeys = {
  all: ['home'] as const,
  quickAccess: () => [...homeKeys.all, 'quickAccess'] as const,
  comments: (page?: number, perPage?: number) =>
    [...homeKeys.all, 'comments', { page, perPage }] as const,
} as const;
