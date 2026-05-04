import { useQuery } from '@tanstack/react-query';

import { fetchCatalogItemDetail } from '@/shared/catalog/api/fetchCatalogItemDetail';
import { catalogKeys } from '@/shared/catalog/model/queryKeys';

const STALE_TIME_MS = 2 * 60 * 1000;

export function useCatalogItemDetail(itemId: number | undefined) {
  const enabled = typeof itemId === 'number' && itemId > 0;

  return useQuery({
    queryKey: enabled
      ? catalogKeys.detail(itemId as number)
      : ([...catalogKeys.all, 'detail', 'skipped'] as const),
    queryFn: () => fetchCatalogItemDetail(itemId as number),
    enabled,
    staleTime: STALE_TIME_MS,
  });
}
