import { z } from 'zod';

/**
 * Verify-payment response — mirrors client-web `VerifyPaymentResponse`.
 * Kept permissive (optional + passthrough) so error/edge shapes never throw at
 * the Zod boundary; the screen reads only the fields it renders.
 */
const numericString = z.union([z.string(), z.number(), z.null()]).optional();

const orderMediaSchema = z
  .object({
    type: z.string().optional(),
    src: z.string().optional(),
  })
  .passthrough();

export const orderCourseSchema = z
  .object({
    id: z.number().optional(),
    category_id: z.number().optional(),
    title_fa: z.string().optional(),
    pivot: z
      .object({ final_price: numericString })
      .passthrough()
      .optional(),
    medias: z.array(orderMediaSchema).optional(),
  })
  .passthrough();

export const orderSchema = z
  .object({
    order_number: z.string().optional(),
    paid_at: z.string().optional(),
    total: numericString,
    totalPayable: numericString,
    user: z
      .object({ email: z.string().optional() })
      .passthrough()
      .optional(),
    courses: z.array(orderCourseSchema).optional(),
  })
  .passthrough();

export const verifyPaymentResponseSchema = z
  .object({
    message: z.string().optional(),
    data: z
      .object({
        order: orderSchema.optional(),
        ref_id: z.union([z.string(), z.number(), z.null()]).optional(),
        card_pan: z.union([z.string(), z.null()]).optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export type VerifyPaymentResult = z.infer<typeof verifyPaymentResponseSchema>;
export type OrderDto = NonNullable<NonNullable<VerifyPaymentResult['data']>['order']>;
export type OrderCourseDto = z.infer<typeof orderCourseSchema>;
