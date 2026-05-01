import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AUTH_USER_QUERY_KEY } from '@/domains/auth/model/queryKeys';
import {
  buildProfileFormData,
  postUpdateProfile,
} from '@/domains/user/api/updateProfile';
import type { EditProfileFormType } from '@/domains/user/model/editProfileForm.schema';

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Pick<EditProfileFormType, 'full_name' | 'avatar'>) => {
      const fd = buildProfileFormData(values);
      return postUpdateProfile(fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY }).catch(() => {});
    },
  });
}
