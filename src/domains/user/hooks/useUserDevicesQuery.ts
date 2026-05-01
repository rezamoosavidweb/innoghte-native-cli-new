import { useQuery } from '@tanstack/react-query';

import { fetchUserDevices } from '@/domains/user/api/fetchUserDevices';
import { USER_DEVICES_QUERY_KEY } from '@/domains/user/model/userAccount.queryKeys';

export function useUserDevicesQuery(enabled = true) {
  return useQuery({
    queryKey: USER_DEVICES_QUERY_KEY,
    queryFn: () => fetchUserDevices(),
    enabled,
    select: res => res.data,
  });
}
