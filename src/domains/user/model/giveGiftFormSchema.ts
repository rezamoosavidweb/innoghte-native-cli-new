import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * Mirrors client-web `@/features/dashboard/give-gift/form/Form.tsx` validation.
 */
export const giveGiftValidationSchema = z.object({
  name: z
    .string()
    .min(1, 'وارد کردن نام الزامی است.')
    .min(2, 'حداقل ۲ کاراکتر')
    .max(50, 'حداکثر ۵۰ کاراکتر'),
  family: z
    .string()
    .min(1, 'وارد کردن نام خانوادگی الزامی است.')
    .min(2, 'حداقل ۲ کاراکتر')
    .max(50, 'حداکثر ۵۰ کاراکتر'),
  email: z
    .string()
    .min(1, 'وارد کردن ایمیل الزامی است.')
    .email('ایمیل معتبر نیست.')
    .min(3, 'حداقل ۳ کاراکتر')
    .max(50, 'حداکثر ۵۰ کاراکتر'),
  mobile: z.object({
    dial: z.string().min(1, { message: 'وارد کردن شماره موبایل الزامی است.' }),
    countryCode: z.string(),
    dialCode: z.string(),
  }),
  selectionGroup: z
    .object({
      courses: z.array(z.string()).optional(),
      albums: z.array(z.string()).optional(),
      rooyeKhats: z.array(z.string()).optional(),
      audioBooks: z.array(z.string()).optional(),
    })
    .superRefine((val, ctx) => {
      const hasAtLeastOne =
        (Array.isArray(val.courses) && val.courses.length > 0) ||
        (Array.isArray(val.albums) && val.albums.length > 0) ||
        (Array.isArray(val.rooyeKhats) && val.rooyeKhats.length > 0) ||
        (Array.isArray(val.audioBooks) && val.audioBooks.length > 0);

      if (!hasAtLeastOne) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'حداقل یکی از گزینه‌های دوره‌ها، آلبوم‌ها، روی‌خط یا کتاب‌ها باید انتخاب شود.',
          path: [],
        });
      }
    }),
  comment: z.string().max(200, 'حداکثر 200 کاراکتر'),
});

export const giveGiftFormResolver = zodResolver(giveGiftValidationSchema);
export type GiveGiftFormType = z.infer<typeof giveGiftValidationSchema>;
