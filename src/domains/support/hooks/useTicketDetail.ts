import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createTicketDraft,
  fetchTicketDetail,
  replyToTicket,
} from '@/domains/support/api/ticketsApi';
import type { CreateTicketFields } from '@/domains/support/model/createTicket.types';
import { ticketsKeys } from '@/domains/support/model/queryKeys';

const STALE_TIME_MS = 5 * 60 * 1000;

/** Authenticated ticket thread — keyed per ticket id (aligned with infinite list staleness). */
export function useTicketDetail(id: number) {
  return useQuery({
    queryKey: ticketsKeys.detail(id),
    queryFn: () => fetchTicketDetail(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: STALE_TIME_MS,
  });
}

/** Reply mutation invalidates detail + list cache so threads and previews stay fresh. */
export function useReplyToTicketMutation(ticketId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: string) => replyToTicket(ticketId, message),
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ticketsKeys.detail(ticketId) })
        .catch(() => {});
      queryClient
        .invalidateQueries({ queryKey: ticketsKeys.infiniteList() })
        .catch(() => {});
    },
  });
}

export function useCreateTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fields: CreateTicketFields) => createTicketDraft(fields),
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ticketsKeys.infiniteList() })
        .catch(() => {});
    },
  });
}
