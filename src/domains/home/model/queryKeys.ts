/**
 * React Query key factory for the home domain. Use the helper methods —
 * never inline arrays at call sites.
 */
export const homeKeys = {
  all: ['home'] as const,
  quickAccess: () => [...homeKeys.all, 'quickAccess'] as const,
} as const;
