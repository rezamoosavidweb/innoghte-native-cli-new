import {
  buildScrollMemoryKey,
  useAppInfiniteList,
} from '@/shared/lib/infiniteList';

import {
  fetchCatalogItemsPage,
  type FetchCatalogItemsPageResult,
} from '@/shared/catalog/api';
import type { CatalogItem } from '@/shared/catalog/model/entities';
import {
  catalogKeys,
  type CatalogItemsInfiniteFilters,
} from '@/shared/catalog/model/queryKeys';

const STALE_TIME_MS = 5 * 60 * 1000;
/** Default page size when `perPage` is omitted. */
const DEFAULT_PER_PAGE = 15;

function getCatalogItemsNextPageParam(
  lastPage: FetchCatalogItemsPageResult,
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

/** Infinite paginated catalog feed — uses {@link useAppInfiniteList}. */
export function useInfiniteCatalogItems(filters?: CatalogItemsInfiniteFilters) {
  const categoryId = filters?.categoryId;
  const perPage = filters?.perPage ?? DEFAULT_PER_PAGE;
  const queryKey = catalogKeys.infiniteList(filters);

  return useAppInfiniteList<
    CatalogItem,
    FetchCatalogItemsPageResult,
    number,
    ReturnType<typeof catalogKeys.infiniteList>
  >({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchCatalogItemsPage(categoryId, pageParam as number, perPage),
    initialPageParam: 1,
    getNextPageParam: last => getCatalogItemsNextPageParam(last),
    staleTime: STALE_TIME_MS,
    scrollMemoryKey: buildScrollMemoryKey(queryKey),
  });
}
