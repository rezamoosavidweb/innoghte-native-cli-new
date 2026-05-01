import { z } from 'zod';

import { apiPaginationResponseFieldSchema } from '@/shared/contracts/pagination.schema';

export const userDeviceDtoSchema = z
  .object({
    id: z.number(),
    active: z.number(),
    browser: z.string(),
    platform: z.string(),
    ip: z.string(),
    last_login: z.string(),
  })
  .passthrough();

export const userDevicesResponseSchema = z
  .object({
    data: z.array(userDeviceDtoSchema),
    message: z.string(),
    pagination: apiPaginationResponseFieldSchema,
  })
  .passthrough();

export type UserDeviceDto = z.infer<typeof userDeviceDtoSchema>;
