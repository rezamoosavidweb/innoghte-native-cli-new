import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import { normalizeListResponse } from '@/shared/infra/http/normalizeListResponse';
import { mapEventItem, type EventType } from '@/domains/events/model/event.entities';

export { type EventType } from '@/domains/events/model/event.entities';

export async function fetchEvents(): Promise<readonly EventType[]> {
  const result = await parseJsonResponse<
    Record<string, unknown>[] | { data?: Record<string, unknown>[] }
  >(getApiClient().get(endpoints.public.events.replace(/^\//, '')));
  return normalizeListResponse(result).map(mapEventItem);
}
