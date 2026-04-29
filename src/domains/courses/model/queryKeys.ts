/**
 * React Query key factory for the courses domain.
 * Use the helper methods (`all`, `list`, `detail`) — never inline arrays.
 */
export type CoursesListFilters = {
  categoryId?: number;
  page?: number;
  perPage?: number;
};

/** Filters for infinite list — pagination cursor is managed by TanStack Query, not part of the key. */
export type CoursesInfiniteListFilters = {
  categoryId?: number;
  perPage?: number;
};

export const coursesKeys = {
  all: ['courses'] as const,
  infiniteList: (filters?: CoursesInfiniteListFilters) => {
    const f = filters ?? {};
    return [...coursesKeys.all, 'infiniteList', f.categoryId ?? null, f.perPage ?? null] as const;
  },
  list: (filters?: CoursesListFilters) => {
    const f = filters ?? {};
    return [...coursesKeys.all, 'list', f.categoryId ?? null, f.page ?? null, f.perPage ?? null] as const;
  },
  detail: (id: string) => [...coursesKeys.all, 'detail', id] as const,
} as const;
