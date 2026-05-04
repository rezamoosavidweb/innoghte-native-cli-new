import {
  buildPublicCoursesQuerySuffix,
  getApiClient,
  parseJsonResponse,
} from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import type { CatalogItemsResponse } from '@/shared/catalog/model/catalogApi.dto';
import { publicCatalogItemsResponseSchema } from '@/shared/catalog/model/schemas';

export async function getCatalogItems(
  category_id?: number,
  page?: number,
  per_page?: number,
): Promise<CatalogItemsResponse> {
  const path = `${endpoints.public.courses}${buildPublicCoursesQuerySuffix({
    category_id,
    page,
    per_page,
  })}`;

  return parseJsonResponse(
    getApiClient().get(path),
    publicCatalogItemsResponseSchema,
  );
}
