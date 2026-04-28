import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import { normalizeListResponse } from '@/shared/infra/http/normalizeListResponse';
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
  return normalizeListResponse(result).map(mapLiveMeetingItem);
}
