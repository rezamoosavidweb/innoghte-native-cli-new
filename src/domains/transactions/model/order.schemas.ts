import { z } from 'zod';

/** Accepts JSON numbers or numeric strings (e.g. `"id": "357062"`); outputs a finite number. */
const finiteNumberFromJson = z
  .union([z.number(), z.string()])
  .transform(v =>
    typeof v === 'number' ? v : Number(String(v).replace(/,/g, '')),
  )
  .pipe(z.number().finite());

const orderCourseSchema = z
  .object({
    id: finiteNumberFromJson,
    /** Present in API v2-style payloads */
    is_package: z.boolean().optional(),
    /** Legacy field name (some endpoints) */
    package: z.number().optional(),
    included_course_ids: z
      .union([z.array(z.number()), z.null()])
      .optional(),
    title_fa: z.string().optional(),
    price: finiteNumberFromJson.optional(),
    final_price: finiteNumberFromJson.optional(),
    discount_amount: finiteNumberFromJson.optional(),
  })
  .passthrough();

const orderPaymentSchema = z
  .object({
    id: finiteNumberFromJson.optional(),
    payment_number: z.string().optional(),
    order_id: z.union([z.string(), z.number()]).optional(),
    user_id: z.union([z.string(), z.number()]).optional(),
    ref_id: z.union([z.string(), z.number(), z.null()]).optional(),
    status: z.string().optional(),
    amount: z.union([z.number(), z.string(), z.null()]).optional(),
    /** Often a Persian-formatted or plain numeric string (e.g. `"900000"`). */
    amount_fa: z.union([z.number(), z.string(), z.null()]).optional(),
    payment_from: z.union([z.string(), z.null()]).optional(),
    authority: z.string().optional(),
    method: z.number().optional(),
    payment_method: z.string().optional(),
  })
  .passthrough();

export const orderDtoSchema = z
  .object({
    /** API may send numeric id as string (`"357062"`). */
    id: finiteNumberFromJson,
    user_id: finiteNumberFromJson.optional(),
    order_number: z.union([z.string(), z.number()]).transform(v => String(v)),
    status: z.string(),
    currency_type: z.enum(['USD', 'IRR']),
    total: z.union([z.string(), z.number()]).transform(v => String(v)),
    total_payable: z.union([z.string(), z.number()]).transform(v => String(v)),
    discount_amount: z.union([z.string(), z.number()]).transform(v => String(v)),
    discount_code: z.union([z.string(), z.null()]).optional(),
    courses: z.array(orderCourseSchema),
    payment: orderPaymentSchema,
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  })
  .passthrough();

export type OrderDto = z.infer<typeof orderDtoSchema>;

const paginationSchema = z
  .object({
    current_page: z.number().optional(),
    total_pages: z.number().optional(),
    per_page: z.number().optional(),
    total_items: z.number().optional(),
  })
  .passthrough();

export const ordersListResponseSchema = z.object({
  data: z.array(z.unknown()),
  message: z.string().optional(),
  pagination: paginationSchema.optional().nullable(),
});
