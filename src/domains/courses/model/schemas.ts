import { z } from 'zod';

import type { PublicCoursesResponse } from '@/domains/courses/model/courseApi.dto';

/**
 * Permissive runtime guard for `PublicCoursesResponse` — validates the
 * envelope (`message` / `data` array / `pagination` object) without locking
 * down every legacy backend field.
 */
export const publicCoursesResponseSchema: z.ZodType<PublicCoursesResponse> = z
  .object({
    message: z.string(),
    data: z.array(z.record(z.string(), z.unknown())),
    pagination: z.record(z.string(), z.unknown()),
  })
  .passthrough() as unknown as z.ZodType<PublicCoursesResponse>;
