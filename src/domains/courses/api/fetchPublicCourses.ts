import {
  buildPublicCoursesQuerySuffix,
  getApiClient,
  parseJsonResponse,
} from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import type { PublicCoursesResponse } from '@/domains/courses/model/courseApi.dto';
import { publicCoursesResponseSchema } from '@/domains/courses/model/schemas';

/** Same signature as client-web `getPublicCourses`. */
export async function getPublicCourses(
  category_id?: number,
  page?: number,
  per_page?: number,
): Promise<PublicCoursesResponse> {
  const path = `${endpoints.public.courses}${buildPublicCoursesQuerySuffix({
    category_id,
    page,
    per_page,
  })}`;

  return parseJsonResponse(
    getApiClient().get(path),
    publicCoursesResponseSchema,
  );
}
