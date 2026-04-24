import { useQuery } from '@tanstack/react-query';

import { fetchLiveMeetings } from '@/features/liveMeetings/api/fetchLiveMeetings';
import { LIVE_MEETINGS_QUERY_KEY } from '@/features/liveMeetings/constants/queryKeys';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useLiveMeetingsQuery() {
  return useQuery({
    queryKey: LIVE_MEETINGS_QUERY_KEY,
    queryFn: fetchLiveMeetings,
    staleTime: STALE_TIME_MS,
  });
}
