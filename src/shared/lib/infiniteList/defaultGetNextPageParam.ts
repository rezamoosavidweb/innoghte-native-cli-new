/** Shared envelope for cursor-based public list APIs. */
export type PageWithPagination<TItem> = {
  items: readonly TItem[];
  pagination: { current_page: number; total_pages: number };
};

export function defaultGetNextPageParam<TItem>(
  lastPage: PageWithPagination<TItem>,
): number | undefined {
  const { current_page: curRaw, total_pages: totalRaw } = lastPage.pagination;
  const current = typeof curRaw === 'number' ? curRaw : Number(curRaw);
  const total = typeof totalRaw === 'number' ? totalRaw : Number(totalRaw);
  if (!Number.isFinite(current) || !Number.isFinite(total)) {
    return undefined;
  }
  if (total < 1) {
    return undefined;
  }
  if (current >= total) {
    return undefined;
  }
  return current + 1;
}
