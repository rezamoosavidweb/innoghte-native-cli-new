import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import type { PublicCoursesResponse } from '@/domains/courses/model/courseApi.dto';
import { publicCoursesResponseSchema } from '@/domains/courses/model/schemas';

export async function getPublicCourses(): Promise<PublicCoursesResponse> {
  return parseJsonResponse(
    getApiClient().get(endpoints.public.courses),
    publicCoursesResponseSchema,
  );
}
