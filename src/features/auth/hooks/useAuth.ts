import { useMutation } from '@tanstack/react-query';

import { login } from '@/shared/api/modules/auth.service';
import type { LoginBodyType } from '@/shared/api/types/auth';

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginBodyType) => login(payload),
  });
}
