/**
 * React Query key factory for the catalog layer.
 * Use the helper methods — never inline arrays.
 */
export type CatalogItemsListFilters = {
  categoryId?: number;
  page?: number;
  perPage?: number;
};

/** Filters for infinite list — pagination cursor is managed by TanStack Query, not part of the key. */
export type CatalogItemsInfiniteFilters = {
  categoryId?: number;
  perPage?: number;
};

export const catalogKeys = {
  all: ['catalog'] as const,
  infiniteList: (filters?: CatalogItemsInfiniteFilters) => {
    const f = filters ?? {};
    return [...catalogKeys.all, 'infiniteList', f.categoryId ?? null, f.perPage ?? null] as const;
  },
  list: (filters?: CatalogItemsListFilters) => {
    const f = filters ?? {};
    return [...catalogKeys.all, 'list', f.categoryId ?? null, f.page ?? null, f.perPage ?? null] as const;
  },
  detail: (id: string | number) =>
    [...catalogKeys.all, 'detail', String(id)] as const,
  /** Paginated public comments — scope by item/category + page for correct caching. */
  commentsPage: (
    itemId: number | undefined,
    categoryId: number | undefined,
    page: number,
    perPage: number,
  ) =>
    [
      ...catalogKeys.all,
      'commentsPage',
      itemId ?? null,
      categoryId ?? null,
      page,
      perPage,
    ] as const,
  commentsScopePrefix: (
    itemId: number | undefined,
    categoryId: number | undefined,
  ) =>
    [...catalogKeys.all, 'commentsPage', itemId ?? null, categoryId ?? null] as const,
} as const;
