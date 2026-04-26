import { useMutation } from '@tanstack/react-query';

import { login } from '@/domains/auth/api/auth.service';
import type { LoginBodyType } from '@/domains/auth/model/apiTypes';

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginBodyType) => login(payload),
  });
}
