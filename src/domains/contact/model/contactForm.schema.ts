import { z } from 'zod';

const mobileDigits = z
  .string()
  .min(8)
  .regex(/^\+?\d[\d\s-]{7,}$/, 'شماره معتبر وارد کنید.');

export const contactFormSchema = z.object({
  full_name: z.string().min(1, 'این فیلد الزامی است.'),
  email: z.string().min(1, 'این فیلد الزامی است.').email('ایمیل معتبر نیست.'),
  mobileDigits: mobileDigits,
  title: z.string().min(1, 'این فیلد الزامی است.'),
  category_id: z.string().min(1, 'انتخاب دسته‌بندی الزامی است.'),
  info: z
    .string()
    .min(1, 'این فیلد الزامی است.')
    .max(200, 'حداکثر 200 کاراکتر'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
