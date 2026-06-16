import { useMutation } from '@tanstack/react-query';

import {
  forgetPasswordEmail,
  forgetPasswordMobile,
} from '@/domains/auth/api/auth.service';

export type ForgetPasswordInput =
  | { mode: 'email'; email: string }
  | { mode: 'mobile'; mobile: string };

/**
 * Requests a password-reset link/code via email or mobile (mirrors the web
 * `postForgetPasswordEmail` / `postForgetPasswordMobile` mutations).
 */
export function useForgetPassword() {
  return useMutation({
    mutationFn: (input: ForgetPasswordInput) =>
      input.mode === 'email'
        ? forgetPasswordEmail(input.email)
        : forgetPasswordMobile(input.mobile),
  });
}
