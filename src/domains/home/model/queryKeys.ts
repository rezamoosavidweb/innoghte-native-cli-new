/**
 * React Query key factory for the home domain. Use the helper methods —
 * never inline arrays at call sites.
 */
export const homeKeys = {
  all: ['home'] as const,
  quickAccess: () => [...homeKeys.all, 'quickAccess'] as const,
  /** Prefix for all comment list variants — use with scoped invalidation (PTR). */
  commentsRoot: () => [...homeKeys.all, 'comments'] as const,
  comments: (page?: number, perPage?: number) =>
    [...homeKeys.commentsRoot(), { page, perPage }] as const,
} as const;
