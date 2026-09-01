import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import { mapEventItem, type EventType } from '@/domains/events/model/event.entities';
import { eventsListResponseSchema } from '@/domains/events/model/schemas';

export { type EventType } from '@/domains/events/model/event.entities';

export async function fetchEvents(): Promise<readonly EventType[]> {
  const result = await parseJsonResponse(
    getApiClient().get(endpoints.public.events, {
      headers: { Scope: 'com' },
    }),
    eventsListResponseSchema,
  );
  const items = Array.isArray(result)
    ? result
    : Array.isArray(result.data)
      ? result.data
      : result.data?.data ?? [];
  return items.map(mapEventItem);
}
