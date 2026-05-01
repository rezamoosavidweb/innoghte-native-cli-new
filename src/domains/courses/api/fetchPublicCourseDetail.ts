import {
  publicCourseDetailResponseSchema,
  type PublicCourseDetailData,
} from '@/domains/courses/model/courseDetail.schema';
import { getApiClient, parseJsonResponse } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';

/** Same contract as client-web `getPublicCourseDetail`. */
export async function fetchPublicCourseDetail(
  courseId: number,
): Promise<PublicCourseDetailData> {
  const path = `${endpoints.public.courseDetail}/${courseId}`;
  const res = await parseJsonResponse(
    getApiClient().get(path),
    publicCourseDetailResponseSchema,
  );
  return res.data;
}
