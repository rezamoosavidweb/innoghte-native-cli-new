import { getApiClient } from '@/shared/infra/http';
import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import { endpoints } from '@/shared/infra/http/endpoints';
import { normalizeListResponse } from '@/shared/infra/http/normalizeListResponse';
import type { FaqType } from '../model/entities';

export { type FaqType } from '../model/entities';

export async function fetchFaqs(): Promise<readonly FaqType[]> {
  const result = await parseJsonResponse<FaqType[] | { data?: FaqType[] }>(
    getApiClient().get(endpoints.public.faq.replace(/^\//, '')),
  );
  return normalizeListResponse(result);
}
