import { z } from 'zod';

import type { PublicCoursesResponse } from '@/domains/courses/model/courseApi.dto';


/** Loose object: unknown keys allowed (replaces deprecated `.passthrough()`). */
export const courseSchema = z.looseObject({
  id: z.number(),
  title_fa: z.string(),
  price: z.number().nullable(),
  discount_price: z.number().nullable(),
  is_accessible: z.boolean().nullable(),
  capacity: z.number().optional().nullable(),
  remain_capacity: z.number().optional().nullable(),
});

/**
 * Permissive runtime guard for `PublicCoursesResponse` — validates the
 * envelope (`message` / `data` array / `pagination` object) without locking
 * down every legacy backend field.
 */
export const publicCoursesResponseSchema: z.ZodType<PublicCoursesResponse> =
  z.looseObject({
    message: z.string(),
    data: z.array(courseSchema),
    pagination: z.record(z.string(), z.unknown()),
  }) as unknown as z.ZodType<PublicCoursesResponse>;
