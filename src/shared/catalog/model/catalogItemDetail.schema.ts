import { z } from 'zod';

import { apiPaginationResponseFieldSchema } from '@/shared/contracts/pagination.schema';

/** Loose runtime guard for single catalog item payload (`CatalogItemDto`-compatible). */
export const catalogItemDetailSchema = z.looseObject({
  id: z.number(),
  title_fa: z.string(),
  short_info: z.string(),
  full_info: z.string(),
  is_accessible: z.boolean().nullable().optional(),
  chapters: z
    .array(
      z.looseObject({
        id: z.number(),
        title_fa: z.string(),
        url: z.string().nullable().optional(),
        short_info: z.string().nullable().optional(),
        full_info: z.string().nullable().optional(),
      }),
    )
    .optional(),
  medias: z
    .array(
      z.looseObject({
        type: z.string(),
        src: z.string(),
        is_cover: z.boolean().optional(),
      }),
    )
    .optional(),
  remain_capacity: z.number().nullable().optional(),
});

export const catalogItemDetailResponseSchema = z.looseObject({
  message: z.string(),
  data: catalogItemDetailSchema,
  pagination: apiPaginationResponseFieldSchema,
});

export type CatalogItemDetail = z.infer<typeof catalogItemDetailSchema>;
