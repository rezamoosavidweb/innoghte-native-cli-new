import { useQuery } from '@tanstack/react-query';

import { fetchCatalogItemComments } from '@/shared/catalog/api/fetchCatalogItemComments';
import { catalogKeys } from '@/shared/catalog/model/queryKeys';

const STALE_TIME_MS = 2 * 60 * 1000;

export function useCatalogItemComments(
  page: number,
  perPage: number,
  itemId?: number,
  categoryId?: number,
) {
  return useQuery({
    queryKey: catalogKeys.commentsPage(itemId, categoryId, page, perPage),
    queryFn: () => fetchCatalogItemComments(page, perPage, itemId, categoryId),
    staleTime: STALE_TIME_MS,
  });
}
