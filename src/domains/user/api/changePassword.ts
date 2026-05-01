import type { ChangePasswordBodyType } from '@/domains/auth/model/apiTypes';
import { changePasswordResponseSchema } from '@/domains/user/model/changePasswordResponse.schema';
import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import { parseJsonResponse } from '@/shared/infra/http/parseJson';

export async function patchChangePassword(body: ChangePasswordBodyType) {
  return parseJsonResponse(
    getApiClient().patch(endpoints.auth.changePassword, { json: body }),
    changePasswordResponseSchema,
  );
}
