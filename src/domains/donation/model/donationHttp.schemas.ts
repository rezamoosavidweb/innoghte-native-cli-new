import { z } from 'zod';

const paginationSchema = z
  .object({
    current_page: z.number().optional(),
    per_page: z.number().optional(),
    total: z.number().optional(),
    next: z.union([z.string(), z.null()]).optional(),
  })
  .optional();

const publicDonationDtoSchema = z.object({
  donate_id: z.number(),
  donate_payment_id: z.number(),
  url: z.string().nullable(),
});

export const publicDonationResponseSchema = z.object({
  message: z.string(),
  data: publicDonationDtoSchema,
  pagination: paginationSchema,
});

/** Verify / execute endpoints — shape varies; keep permissive. */
export const donationActionResponseSchema = z.object({}).passthrough();
