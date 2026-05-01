import { z } from 'zod';

export const profileUpdateResponseSchema = z
  .object({
    data: z.record(z.string(), z.unknown()),
    message: z.string(),
  })
  .passthrough();
