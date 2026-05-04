import { publicCommentsResponseSchema } from '@/domains/home/model/comments.schema';
import { getApiClient, parseJsonResponse } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import type { z } from 'zod';

export async function fetchCatalogItemComments(
  page: number,
  perPage: number,
  itemId?: number,
  categoryId?: number,
): Promise<z.infer<typeof publicCommentsResponseSchema>> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  if (itemId !== undefined && itemId > 0) {
    params.append('course_id', String(itemId));
  }
  if (categoryId !== undefined && categoryId > 0) {
    params.append('category_id', String(categoryId));
  }
  const path = `${endpoints.public.comments}?${params.toString()}`;
  return parseJsonResponse(
    getApiClient().get(path),
    publicCommentsResponseSchema,
  );
}
