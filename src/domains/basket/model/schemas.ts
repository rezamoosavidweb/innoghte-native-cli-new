import { catalogItemSchema } from '@/shared/catalog/model/schemas';
import { z } from 'zod';

const paginationFlexible = z.union([
  z.array(z.record(z.string(), z.unknown())),
  z.record(z.string(), z.unknown()),
]);

export const cartDtoSchema = z
  .object({
    id: z.number(),
    course_id: z.number(),
    course: catalogItemSchema.nullable(),
  })
  .passthrough();

export const publicCartListResponseSchema = z
  .object({
    message: z.string(),
    data: z.array(cartDtoSchema),
    pagination: paginationFlexible,
  })
  .passthrough();

export type CartDto = z.infer<typeof cartDtoSchema>;

export const checkDiscountCodeDtoSchema = z
  .object({
    status: z.number(),
    discount_code: z.string(),
    discount_amount: z.number(),
    total_price: z.number(),
    final_price: z.number(),
  })
  .passthrough();

export const publicCheckDiscountResponseSchema = z
  .object({
    message: z.string(),
    data: checkDiscountCodeDtoSchema,
    pagination: z.union([
      z.array(z.unknown()),
      z.record(z.string(), z.unknown()),
    ]),
  })
  .passthrough();

export type CheckDiscountCodeDto = z.infer<typeof checkDiscountCodeDtoSchema>;

export const createOrderDtoSchema = z
  .object({
    payment_id: z.number(),
    present_id: z.union([z.number(), z.null()]).optional(),
    final_price: z.number(),
    discount_code: z.union([z.string(), z.null()]).optional(),
    url: z.string(),
  })
  .passthrough();

export const createPaymentResponseSchema = z
  .object({
    message: z.string(),
    data: createOrderDtoSchema,
    pagination: z.union([
      z.array(z.unknown()),
      z.record(z.string(), z.unknown()),
    ]),
  })
  .passthrough();

export type CreatePaymentResult = z.infer<typeof createPaymentResponseSchema>;
