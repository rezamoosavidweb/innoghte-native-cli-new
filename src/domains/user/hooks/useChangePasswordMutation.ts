import { useMutation } from '@tanstack/react-query';

import type { ChangePasswordBodyType } from '@/domains/auth/model/apiTypes';
import { patchChangePassword } from '@/domains/user/api/changePassword';

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async (values: ChangePasswordBodyType) => {
      return patchChangePassword(values);
    },
  });
}
