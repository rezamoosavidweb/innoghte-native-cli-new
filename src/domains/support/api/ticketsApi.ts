/**
 * Authenticated ticket endpoints — paths are relative to the HTTP client prefix
 * ({@link resolveApiBaseUrl}: use `API_BASE_URL` / `REACT_NATIVE_API_URL`,
 * e.g. `https://admin.innoghte.ir`).
 */
import { z } from 'zod';

import type {
  Ticket,
  TicketDetail,
  TicketThreadAuthorRole,
  TicketThreadMessage,
} from '@/domains/support/model/ticket.types';
import { parseJsonResponse } from '@/shared/infra/http';
import { getApiClient } from '@/shared/infra/http/appHttpClient';
import type { PageWithPagination } from '@/shared/lib/infiniteList/defaultGetNextPageParam';

export const TICKETS_PER_PAGE = 20;

/** Laravel-style paginator slice often exposed as `pagination.next`. */
const paginationSchema = z
  .object({
    next: z.union([z.string(), z.null()]).optional(),
  })
  .optional();

const ticketRowWireSchema = z.object({
  id: z.number(),
  ticket_number: z.string(),
  title: z.string(),
  status: z.string(),
  category: z.union([z.string(), z.null()]).optional(),
  created_at: z.string(),
});

const ticketsListWireSchema = z.object({
  data: z.array(ticketRowWireSchema),
  pagination: paginationSchema,
  message: z.string().optional(),
});

const ticketResponseWireSchema = z.object({
  id: z.number(),
  ticket_id: z.number(),
  message: z.string(),
  admin_author_id: z.union([z.number(), z.null()]),
  user_id: z.union([z.number(), z.null()]),
  created_at: z.string(),
  updated_at: z.string(),
});

const ticketDetailWireSchema = z
  .object({
    id: z.number(),
    ticket_number: z.string(),
    title: z.string(),
    status: z.string(),
    category: z.union([z.string(), z.null()]).optional(),
    created_at: z.string(),
    description: z.string().optional(),
    ticket_responses: z.array(ticketResponseWireSchema).optional(),
  })
  .passthrough();

const ticketDetailEnvelopeSchema = z.object({
  data: ticketDetailWireSchema,
  message: z.string().optional(),
});

export function mapTicketWire(row: z.infer<typeof ticketRowWireSchema>): Ticket {
  const rawCategory = row.category;
  const category =
    typeof rawCategory === 'string' ? rawCategory.trim() : '';

  return {
    id: row.id,
    ticketNumber: row.ticket_number,
    title: row.title,
    status: row.status,
    category,
    createdAt: row.created_at,
  };
}

function mapThreadRole(response: z.infer<typeof ticketResponseWireSchema>): TicketThreadAuthorRole {
  return response.admin_author_id !== null ? 'staff' : 'user';
}

function mapTicketDetailWire(data: z.infer<typeof ticketDetailWireSchema>): TicketDetail {
  const rawCategory = data.category;
  const category =
    typeof rawCategory === 'string' ? rawCategory.trim() : '';

  const responses = data.ticket_responses ?? [];
  const messages: TicketThreadMessage[] = [...responses]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map(response => ({
      id: response.id,
      body: response.message,
      authorRole: mapThreadRole(response),
      createdAt: response.created_at,
    }));

  return {
    id: data.id,
    ticketNumber: data.ticket_number,
    title: data.title,
    status: data.status,
    category,
    createdAt: data.created_at,
    description: data.description ?? '',
    messages,
  };
}

/** One page wired for {@link useAppInfiniteList} / {@link PageWithPagination}. */
export type FetchTicketsPageResult = PageWithPagination<Ticket>;

/**
 * Laravel `pagination.next` drives has-next; synthesize `current_page` / `total_pages`
 * so {@link defaultGetNextPageParam} matches Courses-style paging.
 */
export async function fetchTicketsPage(
  page: number,
): Promise<FetchTicketsPageResult> {
  const ky = getApiClient();
  const raw = await parseJsonResponse(
    ky.get('api/v1/tickets', {
      searchParams: {
        per_page: String(TICKETS_PER_PAGE),
        page: String(page),
      },
    }),
    ticketsListWireSchema,
  );

  const items = raw.data.map(mapTicketWire);
  const next = raw.pagination?.next;
  const hasNextPage = typeof next === 'string' && next.length > 0;

  return {
    items,
    pagination: {
      current_page: page,
      total_pages: hasNextPage ? page + 1 : page,
    },
  };
}

export async function fetchTicketDetail(id: number): Promise<TicketDetail> {
  const ky = getApiClient();
  const raw = await parseJsonResponse(
    ky.get(`api/v1/tickets/show/${id}`),
    ticketDetailEnvelopeSchema,
  );
  return mapTicketDetailWire(raw.data);
}

const createEnvelopeSchema = z.object({
  data: z.union([
    z.object({ id: z.number() }).passthrough(),
    z.array(z.object({ id: z.number() }).passthrough()),
  ]),
  message: z.string().optional(),
});

export async function createTicketDraft(input: {
  title: string;
  description: string;
}): Promise<number> {
  const ky = getApiClient();
  const fd = new FormData();
  fd.append('title', input.title);
  fd.append('description', input.description);
  fd.append('category', 'general_support');
  fd.append('priority', 'medium');

  const raw = await parseJsonResponse(
    ky.post('api/v1/tickets/create', { body: fd }),
    createEnvelopeSchema,
  );

  const payload = raw.data;
  if (Array.isArray(payload)) {
    const id = payload[0]?.id;
    if (typeof id !== 'number') {
      throw new Error('Invalid ticket create response');
    }
    return id;
  }
  return payload.id;
}

export async function replyToTicket(id: number, message: string): Promise<void> {
  const ky = getApiClient();
  const fd = new FormData();
  fd.append('message', message);

  await ky.post(`api/v1/tickets/${id}/reply`, { body: fd });
}
