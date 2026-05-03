import { useMutation } from '@tanstack/react-query';

import { register } from '@/domains/auth/api/auth.service';
import type { RegisterBodyType } from '@/domains/auth/model/apiTypes';

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterBodyType) => register(payload),
  });
}
