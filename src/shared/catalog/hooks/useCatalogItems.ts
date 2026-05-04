import { useQuery } from '@tanstack/react-query';

import {
  catalogKeys,
  type CatalogItemsListFilters,
} from '@/shared/catalog/model/queryKeys';
import { fetchCatalogItems } from '@/shared/catalog/api';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useCatalogItems(filters?: CatalogItemsListFilters) {
  const { categoryId, page, perPage } = filters ?? {};
  return useQuery({
    queryKey: catalogKeys.list(filters),
    queryFn: () => fetchCatalogItems(categoryId, page, perPage),
    staleTime: STALE_TIME_MS,
  });
}
