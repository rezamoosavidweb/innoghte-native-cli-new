import { z } from 'zod';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^[0-9+]{8,15}$/;

export type LoginValidationMessages = {
  invalidEmail: string;
  invalidMobile: string;
  passwordMin: string;
};

const DEFAULT_LOGIN_VALIDATION_MESSAGES: LoginValidationMessages = {
  invalidEmail: 'Enter a valid email address.',
  invalidMobile: 'Enter a valid mobile number.',
  passwordMin: 'Password must be at least 6 characters.',
};

const mobilePhoneSchema = z.object({
  dial: z.string(),
  countryCode: z.string(),
  dialCode: z.string(),
});

export const createLoginSchema = (
  messages: LoginValidationMessages = DEFAULT_LOGIN_VALIDATION_MESSAGES,
) =>
  z
    .object({
      mode: z.enum(['email', 'mobile']),
      email: z.string().optional(),
      mobile: mobilePhoneSchema,
      password: z.string().min(6, messages.passwordMin),
    })
    .superRefine((value, ctx) => {
      if (value.mode === 'email') {
        const email = value.email?.trim().toLowerCase();
        if (!email || !EMAIL_PATTERN.test(email)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['email'],
            message: messages.invalidEmail,
          });
        }
      }

      if (value.mode === 'mobile') {
        const digits = value.mobile.dial.replace(/\D/g, '');
        if (!digits || !MOBILE_PATTERN.test(digits)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['mobile', 'dial'],
            message: messages.invalidMobile,
          });
        }
      }
    });

export const loginSchema = createLoginSchema();

export type LoginFormType = z.infer<ReturnType<typeof createLoginSchema>>;
