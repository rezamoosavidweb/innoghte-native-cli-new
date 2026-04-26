import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import type { PublicCoursesResponse } from '@/domains/courses/model/courseApi.dto';

export async function getPublicCourses(): Promise<PublicCoursesResponse> {
  return parseJsonResponse<PublicCoursesResponse>(
    getApiClient().get(endpoints.public.courses),
  );
}
