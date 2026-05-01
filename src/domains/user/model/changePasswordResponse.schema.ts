import { z } from 'zod';

export const changePasswordResponseSchema = z
  .object({
    message: z.string(),
    data: z.unknown().optional(),
  })
  .passthrough();
