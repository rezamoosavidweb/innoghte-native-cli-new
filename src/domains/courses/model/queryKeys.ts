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
  detail: (id: string | number) =>
    [...coursesKeys.all, 'detail', String(id)] as const,
  /** Paginated public comments — scope by course/category + page for correct caching. */
  commentsPage: (
    courseId: number | undefined,
    categoryId: number | undefined,
    page: number,
    perPage: number,
  ) =>
    [
      ...coursesKeys.all,
      'commentsPage',
      courseId ?? null,
      categoryId ?? null,
      page,
      perPage,
    ] as const,
  commentsScopePrefix: (
    courseId: number | undefined,
    categoryId: number | undefined,
  ) =>
    [...coursesKeys.all, 'commentsPage', courseId ?? null, categoryId ?? null] as const,
} as const;
