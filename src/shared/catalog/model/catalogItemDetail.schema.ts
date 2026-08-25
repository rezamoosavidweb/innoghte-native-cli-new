import { z } from 'zod';

import { apiPaginationResponseFieldSchema } from '@/shared/contracts/pagination.schema';

/** Loose runtime guard for single catalog item payload (`CatalogItemDto`-compatible). */
export const catalogItemDetailSchema = z.looseObject({
  id: z.number(),
  title_fa: z.string(),
  short_info: z.string(),
  full_info: z.string(),
  from_album: z.string().nullable(),
  color: z.string().nullable(),
  price: z.number(),
  discount_price: z.number().nullable().optional(),
  duration: z.string().nullable().optional(),
  is_accessible: z.boolean().nullable().optional(),
  is_downloadable: z.number().optional(),
  requirements: z.string().nullable(),
  demo: z.string().nullable(),
  access_type: z.string().nullable(),
  is_package: z.boolean().nullable().optional(),
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
  included_courses: z
    .array(
      z.looseObject({
        id: z.number(),
        title_fa: z.string(),
        short_info: z.string().nullable().optional(),
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
  details: z
    .array(
      z.looseObject({
        title: z.string(),
        info: z.string(),
        image: z.string(),
      }),
    )
    .optional(),
  remain_capacity: z.number().nullable().optional(),
  audio_book_detail: z
    .looseObject({
      section1_description: z.string().nullable().optional(),
      section2_title: z.string().nullable().optional(),
      section2_description: z.string().nullable().optional(),
      section3_title: z.string().nullable().optional(),
      section3_description: z.string().nullable().optional(),
      section4_title: z.string().nullable().optional(),
      section4_description: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const catalogItemDetailResponseSchema = z.looseObject({
  message: z.string(),
  data: catalogItemDetailSchema,
  pagination: apiPaginationResponseFieldSchema,
});

export type CatalogItemDetail = z.infer<typeof catalogItemDetailSchema>;
