import { fetchTicketsPage, type FetchTicketsPageResult } from '@/domains/support/api/ticketsApi';
import type { Ticket } from '@/domains/support/model/ticket.types';
import { ticketsKeys } from '@/domains/support/model/queryKeys';
import { buildScrollMemoryKey, useAppInfiniteList } from '@/shared/lib/infiniteList';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useInfiniteTickets() {
  const queryKey = ticketsKeys.infiniteList();
  return useAppInfiniteList<
    Ticket,
    FetchTicketsPageResult,
    number,
    ReturnType<typeof ticketsKeys.infiniteList>
  >({
    queryKey,
    queryFn: ({ pageParam }) => fetchTicketsPage(pageParam as number),
    initialPageParam: 1,
    staleTime: STALE_TIME_MS,
    scrollMemoryKey: buildScrollMemoryKey(queryKey),
  });
}
