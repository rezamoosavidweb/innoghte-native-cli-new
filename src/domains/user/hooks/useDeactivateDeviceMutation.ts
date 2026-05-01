import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deactivateUserDevice } from '@/domains/user/api/deactivateUserDevice';
import { USER_DEVICES_QUERY_KEY } from '@/domains/user/model/userAccount.queryKeys';

export function useDeactivateDeviceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deviceId: number) => deactivateUserDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_DEVICES_QUERY_KEY }).catch(() => {});
    },
  });
}
