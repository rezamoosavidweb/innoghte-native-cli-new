export { getCatalogItems } from './fetchCatalogItems';

import {
  mapCatalogItemDtoToCatalogItem,
  type CatalogItem,
} from '../model/entities';
import { getCatalogItems } from './fetchCatalogItems';

import type { PaginationDto } from '@/shared/contracts/pagination';

/** One page for useInfiniteQuery — keeps pagination meta for `getNextPageParam`. */
export type FetchCatalogItemsPageResult = {
  items: readonly CatalogItem[];
  pagination: PaginationDto;
};

export async function fetchCatalogItemsPage(
  category_id?: number,
  page?: number,
  per_page?: number,
): Promise<FetchCatalogItemsPageResult> {
  const response = await getCatalogItems(category_id, page, per_page);
  return {
    items: (response.data ?? []).map(mapCatalogItemDtoToCatalogItem),
    pagination: response.pagination,
  };
}

export async function fetchCatalogItems(
  category_id?: number,
  page?: number,
  per_page?: number,
): Promise<readonly CatalogItem[]> {
  const { items } = await fetchCatalogItemsPage(category_id, page, per_page);
  return items;
}
