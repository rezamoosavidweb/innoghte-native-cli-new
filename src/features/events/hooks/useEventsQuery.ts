import { useQuery } from '@tanstack/react-query';

import { fetchEvents } from '@/features/events/api';
import { EVENTS_QUERY_KEY } from '@/features/events/constants/queryKeys';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useEventsQuery() {
  return useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: fetchEvents,
    staleTime: STALE_TIME_MS,
  });
}
