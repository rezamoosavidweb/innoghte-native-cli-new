/**
 * React Query key factory for the courses domain.
 * Use the helper methods (`all`, `list`, `detail`) — never inline arrays.
 */
export const coursesKeys = {
  all: ['courses'] as const,
  list: () => [...coursesKeys.all, 'list'] as const,
  detail: (id: string) => [...coursesKeys.all, 'detail', id] as const,
} as const;
