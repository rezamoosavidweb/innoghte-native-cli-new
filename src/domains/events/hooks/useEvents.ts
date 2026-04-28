import { useQuery } from '@tanstack/react-query';

import { EVENTS_QUERY_KEY } from '@/domains/events/model/queryKeys';
import { fetchEvents } from '@/domains/events/api';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useEvents() {
  return useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: fetchEvents,
    staleTime: STALE_TIME_MS,
  });
}
