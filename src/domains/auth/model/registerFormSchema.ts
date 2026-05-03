import { z } from 'zod';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^[0-9+]{8,15}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters.').max(50, 'Name must be at most 50 characters.'),
    family: z.string().min(2, 'Last name must be at least 2 characters.').max(50, 'Last name must be at most 50 characters.'),
    email: z.string().refine(
      val => EMAIL_PATTERN.test(val.trim().toLowerCase()),
      { message: 'Enter a valid email address.' },
    ),
    mobile: z
      .object({
        dial: z.string(),
        countryCode: z.string(),
        dialCode: z.string(),
      })
      .refine(
        val => MOBILE_PATTERN.test(val.dial.replace(/\D/g, '')),
        { message: 'Enter a valid mobile number.', path: ['dial'] },
      ),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters.')
      .max(50, 'Password must be at most 50 characters.')
      .regex(PASSWORD_PATTERN, 'Password must contain both letters and numbers.'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters.')
      .max(50, 'Password must be at most 50 characters.'),
    acceptTerms: z
      .boolean()
      .refine(val => val === true, { message: 'You must accept the terms and conditions.' }),
    ref_code: z.string().optional(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
      });
    }
  });

export const otpSchema = z.object({
  otp: z.string().min(3, 'Code must be at least 3 characters.'),
});

export type RegisterFormType = z.infer<typeof registerSchema>;
export type OtpFormType = z.infer<typeof otpSchema>;
