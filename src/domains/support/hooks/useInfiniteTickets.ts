import { fetchTicketsPage, type FetchTicketsPageResult } from '@/domains/support/api/ticketsApi';
import type { Ticket } from '@/domains/support/model/ticket.types';
import { ticketsKeys } from '@/domains/support/model/queryKeys';
import { useAppInfiniteList } from '@/shared/lib/infiniteList';

const STALE_TIME_MS = 5 * 60 * 1000;

function buildTicketsScrollMemoryKey(): string {
  return `scroll:list:${JSON.stringify(ticketsKeys.infiniteList())}`;
}

/**
 * Authenticated infinite ticket list — same stack as courses ({@link useAppInfiniteList}).
 */
export function useInfiniteTickets() {
  return useAppInfiniteList<
    Ticket,
    FetchTicketsPageResult,
    number,
    ReturnType<typeof ticketsKeys.infiniteList>
  >({
    queryKey: ticketsKeys.infiniteList(),
    queryFn: ({ pageParam }) => fetchTicketsPage(pageParam as number),
    initialPageParam: 1,
    staleTime: STALE_TIME_MS,
    scrollMemoryKey: buildTicketsScrollMemoryKey(),
  });
}
