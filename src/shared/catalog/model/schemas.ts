import { z } from 'zod';

import type { CatalogItemsResponse } from '@/shared/catalog/model/catalogApi.dto';
import { apiPaginationResponseFieldSchema } from '@/shared/contracts/pagination.schema';

/** Permissive runtime guard for a single catalog item in a list response. */
export const catalogItemSchema = z.looseObject({
  id: z.number(),
  title_fa: z.string(),
  price: z.number().nullable(),
  discount_price: z.number().nullable(),
  is_accessible: z.boolean().nullable(),
  capacity: z.number().optional().nullable(),
  remain_capacity: z.number().optional().nullable(),
});

/**
 * Permissive runtime guard for `CatalogItemsResponse` — validates the
 * envelope (`message` / `data` array / `pagination` object) without locking
 * down every legacy backend field.
 */
export const publicCatalogItemsResponseSchema: z.ZodType<CatalogItemsResponse> =
  z.looseObject({
    message: z.string(),
    data: z.array(catalogItemSchema),
    pagination: apiPaginationResponseFieldSchema,
  }) as unknown as z.ZodType<CatalogItemsResponse>;
