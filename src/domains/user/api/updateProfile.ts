import type { EditProfileFormType } from '@/domains/user/model/editProfileForm.schema';
import { profileUpdateResponseSchema } from '@/domains/user/model/profileUpdateResponse.schema';
import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import { parseJsonResponse } from '@/shared/infra/http/parseJson';

export function buildProfileFormData(
  values: Pick<EditProfileFormType, 'full_name' | 'avatar'>,
): FormData {
  const fd = new FormData();
  fd.append('full_name', values.full_name.trim());
  const { avatar } = values;
  if (
    typeof avatar === 'object' &&
    avatar !== null &&
    'uri' in avatar &&
    avatar.uri
  ) {
    fd.append('avatar', {
      uri: avatar.uri,
      type: avatar.type,
      name: avatar.name,
      // RN multipart — Metro resolves native upload shape.
    } as unknown as Blob);
  }
  return fd;
}

export async function postUpdateProfile(formData: FormData) {
  return parseJsonResponse(
    getApiClient().post(endpoints.auth.editProfile, { body: formData }),
    profileUpdateResponseSchema,
  );
}
