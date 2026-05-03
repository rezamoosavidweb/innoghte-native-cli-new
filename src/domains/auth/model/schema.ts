import { z } from 'zod';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^[0-9+]{8,15}$/;

const mobilePhoneSchema = z.object({
  dial: z.string(),
  countryCode: z.string(),
  dialCode: z.string(),
});

export const loginSchema = z
  .object({
    mode: z.enum(['email', 'mobile']),
    email: z.string().optional(),
    mobile: mobilePhoneSchema,
    password: z.string().min(6, 'Password must be at least 6 characters.'),
  })
  .superRefine((value, ctx) => {
    if (value.mode === 'email') {
      const email = value.email?.trim().toLowerCase();
      if (!email || !EMAIL_PATTERN.test(email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: 'Enter a valid email address.',
        });
      }
    }

    if (value.mode === 'mobile') {
      const digits = value.mobile.dial.replace(/\D/g, '');
      if (!digits || !MOBILE_PATTERN.test(digits)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mobile', 'dial'],
          message: 'Enter a valid mobile number.',
        });
      }
    }
  });

export type LoginFormType = z.infer<typeof loginSchema>;
