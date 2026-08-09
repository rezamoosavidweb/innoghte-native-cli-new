import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import {
  mapLiveMeetingItem,
  type LiveMeetingType,
} from '@/domains/live/model/liveMeeting.entities';
import { liveMeetingsListResponseSchema } from '@/domains/live/model/schemas';

export { type LiveMeetingType } from '@/domains/live/model/liveMeeting.entities';

export async function fetchLiveMeetings(): Promise<readonly LiveMeetingType[]> {
  const result = await parseJsonResponse(
    getApiClient().get(endpoints.public.liveMeeting),
    liveMeetingsListResponseSchema,
  );
  const items = Array.isArray(result)
    ? result
    : result.data ?? [
        ...(result.package_lives ?? []),
        ...(result.finished_lives ?? []),
        ...(result.next_lives ?? []),
      ];
  return items.map(mapLiveMeetingItem);
}
