/**
 * TanStack Query key factory — never inline arrays for ticket queries.
 */

import { TICKETS_PER_PAGE } from '@/domains/support/api/ticketsApi';

export const ticketsKeys = {
  all: ['tickets'] as const,
  infiniteList: () =>
    [...ticketsKeys.all, 'infiniteList', TICKETS_PER_PAGE] as const,
  detail: (id: number) => [...ticketsKeys.all, 'detail', id] as const,
} as const;
