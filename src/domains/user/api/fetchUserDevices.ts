import { userDevicesResponseSchema } from '@/domains/user/model/userDevices.schema';
import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import { parseJsonResponse } from '@/shared/infra/http/parseJson';

export async function fetchUserDevices(page = 1, per_page = 20) {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(per_page),
  });
  return parseJsonResponse(
    getApiClient().get(`${endpoints.auth.userDevices}?${params}`),
    userDevicesResponseSchema,
  );
}
