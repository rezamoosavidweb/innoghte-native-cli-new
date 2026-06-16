import { z } from 'zod';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^[0-9+]{8,15}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'حداقل ۲ کاراکتر').max(50, 'حداکثر ۵۰ کاراکتر'),
    family: z.string().min(2, 'حداقل ۲ کاراکتر').max(50, 'حداکثر ۵۰ کاراکتر'),
    email: z.string().refine(
      val => EMAIL_PATTERN.test(val.trim().toLowerCase()),
      { message: 'ایمیل معتبر نیست.' },
    ),
    mobile: z
      .object({
        dial: z.string(),
        countryCode: z.string(),
        dialCode: z.string(),
      })
      .refine(
        val => MOBILE_PATTERN.test(val.dial.replace(/\D/g, '')),
        { message: 'شماره موبایل معتبر نیست.', path: ['dial'] },
      ),
    password: z
      .string()
      .min(6, 'حداقل ۶ کاراکتر')
      .max(50, 'حداکثر ۵۰ کاراکتر')
      .regex(PASSWORD_PATTERN, 'رمز باید شامل حروف انگلیسی و عدد باشد.'),
    confirmPassword: z
      .string()
      .min(6, 'حداقل ۶ کاراکتر')
      .max(50, 'حداکثر ۵۰ کاراکتر'),
    acceptTerms: z
      .boolean()
      .refine(val => val === true, { message: 'باید شرایط و ضوابط را بپذیرید.' }),
    ref_code: z.string().optional(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'رمز عبور با تکرار آن مطابقت ندارد.',
        path: ['confirmPassword'],
      });
    }
  });

export type RegisterFormType = z.infer<typeof registerSchema>;
