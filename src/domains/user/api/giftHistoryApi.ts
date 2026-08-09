import { z } from 'zod';

import { getApiClient, parseJsonResponse } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';

const personSchema = z
  .object({
    name: z.string().nullish(),
    family: z.string().nullish(),
    full_name: z.string().nullish(),
    email: z.string().nullish(),
    mobile: z.string().nullish(),
    email_verified_at: z.string().nullish(),
    mobile_verified_at: z.string().nullish(),
  })
  .passthrough();

const courseSchema = z
  .object({
    course_id: z.number(),
    course_name: z.string(),
    final_price: z.coerce.number().optional(),
  })
  .passthrough();

const paymentSchema = z
  .object({
    status: z.coerce.number().nullish(),
    payment_number: z.string().nullish(),
  })
  .passthrough();

const orderSchema = z
  .object({
    order_number: z.string().nullish(),
    CurrencyType: z.string().nullish(),
    totalPayable: z.union([z.string(), z.number()]).nullish(),
    courses: z.array(courseSchema).optional().default([]),
    payment: paymentSchema.nullish(),
  })
  .passthrough();

export const giftHistoryItemSchema = z
  .object({
    id: z.number(),
    code: z.string().nullish(),
    message: z.string().nullish(),
    status: z.union([z.string(), z.number()]).nullish(),
    created_at: z.string(),
    receiver_first_name: z.string().nullish(),
    receiver_last_name: z.string().nullish(),
    receiver_email: z.string().nullish(),
    sender: personSchema.nullish(),
    receiver: personSchema.nullish(),
    order: orderSchema.nullish(),
  })
  .passthrough();

const giftHistoryResponseSchema = z
  .object({
    data: z.array(giftHistoryItemSchema).optional().default([]),
  })
  .passthrough();

export type GiftHistoryItem = z.infer<typeof giftHistoryItemSchema>;
export type GiftHistoryKind = 'received' | 'sent';

export async function fetchGiftHistory(
  kind: GiftHistoryKind,
): Promise<readonly GiftHistoryItem[]> {
  const endpoint =
    kind === 'received'
      ? endpoints.user.receivedPresents
      : endpoints.user.sentPresents;
  const path = `${endpoint}?page=1&per_page=100`;
  const response = await parseJsonResponse(
    getApiClient().get(path),
    giftHistoryResponseSchema,
  );
  return response.data;
}
