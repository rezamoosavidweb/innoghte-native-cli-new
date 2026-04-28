import {
  mapQuickAccessDto,
  type QuickAccessItem,
  type QuickAccessResponse,
} from '@/domains/home/model/quickAccess.dto';
import { quickAccessResponseSchema } from '@/domains/home/model/quickAccess.schema';
import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import { parseJsonResponse } from '@/shared/infra/http/parseJson';

export async function fetchQuickAccess(): Promise<readonly QuickAccessItem[]> {
  const response: QuickAccessResponse = await parseJsonResponse(
    getApiClient().get(endpoints.public.quickAccess),
    quickAccessResponseSchema,
  );
  return (response.data ?? []).map(mapQuickAccessDto);
}
