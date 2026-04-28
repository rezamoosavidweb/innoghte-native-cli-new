import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import { normalizeListResponse } from '@/shared/infra/http/normalizeListResponse';
import { mapEventItem, type EventType } from '@/domains/events/model/event.entities';
import { eventsListResponseSchema } from '@/domains/events/model/schemas';

export { type EventType } from '@/domains/events/model/event.entities';

export async function fetchEvents(): Promise<readonly EventType[]> {
  const result = await parseJsonResponse(
    getApiClient().get(endpoints.public.events),
    eventsListResponseSchema,
  );
  return normalizeListResponse(result).map(mapEventItem);
}
