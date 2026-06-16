import { z } from 'zod';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Forget-password form — recover via email or mobile (mirrors the web
 * `forget-password-email` / `forget-password-mobile` forms). `mode` selects
 * which identifier is validated, matching the LoginScreen email/mobile tabs.
 */
export const forgetPasswordSchema = z
  .object({
    mode: z.enum(['email', 'mobile']),
    email: z.string(),
    mobile: z.object({
      dial: z.string(),
      countryCode: z.string(),
      dialCode: z.string(),
    }),
  })
  .superRefine((values, ctx) => {
    if (values.mode === 'email') {
      if (!EMAIL_PATTERN.test(values.email.trim().toLowerCase())) {
        ctx.addIssue({
          code: 'custom',
          message: 'ایمیل معتبر نیست.',
          path: ['email'],
        });
      }
      return;
    }
    if (values.mobile.dial.replace(/\D/g, '').length < 8) {
      ctx.addIssue({
        code: 'custom',
        message: 'شماره موبایل معتبر نیست.',
        path: ['mobile', 'dial'],
      });
    }
  });

export type ForgetPasswordFormType = z.infer<typeof forgetPasswordSchema>;
