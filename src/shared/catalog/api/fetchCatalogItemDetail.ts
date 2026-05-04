import {
  catalogItemDetailResponseSchema,
  type CatalogItemDetail,
} from '@/shared/catalog/model/catalogItemDetail.schema';
import { getApiClient, parseJsonResponse } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';

export async function fetchCatalogItemDetail(
  itemId: number,
): Promise<CatalogItemDetail> {
  const path = `${endpoints.public.courseDetail}/${itemId}`;
  const res = await parseJsonResponse(
    getApiClient().get(path),
    catalogItemDetailResponseSchema,
  );
  return res.data;
}
