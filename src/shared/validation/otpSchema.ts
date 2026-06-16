import { z } from 'zod';

/**
 * Shared OTP code validation — used by every verification flow (register,
 * contact). The web uses a free-length one-time-code field, so this only
 * enforces a non-empty (trimmed) code; flow-specific payloads stay in each
 * domain's API layer.
 */
export const otpSchema = z.object({
  code: z.string().trim().min(1, 'کد تأیید را وارد کنید.'),
});

export type OtpFormType = z.infer<typeof otpSchema>;

/** True when `code` is a usable (non-empty) OTP. */
export function isOtpCodeValid(code: string): boolean {
  return otpSchema.safeParse({ code }).success;
}
