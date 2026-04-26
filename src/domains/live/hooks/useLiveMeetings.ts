import { useQuery } from '@tanstack/react-query';

import { LIVE_MEETINGS_QUERY_KEY } from '@/shared/infra/query/queryKeys';
import { fetchLiveMeetings } from '@/domains/live/api';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useLiveMeetings() {
  return useQuery({
    queryKey: LIVE_MEETINGS_QUERY_KEY,
    queryFn: fetchLiveMeetings,
    staleTime: STALE_TIME_MS,
  });
}
