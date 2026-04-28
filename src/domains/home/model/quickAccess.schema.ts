import { z } from 'zod';

import type { QuickAccessResponse } from '@/domains/home/model/quickAccess.dto';

/**
 * Permissive runtime guard for `QuickAccessResponse` — validates the
 * envelope (`message` / `data` array) without locking down legacy fields.
 */
export const quickAccessResponseSchema: z.ZodType<QuickAccessResponse> = z
  .object({
    message: z.string().optional(),
    data: z.array(z.record(z.string(), z.unknown())),
  })
  .passthrough() as unknown as z.ZodType<QuickAccessResponse>;
