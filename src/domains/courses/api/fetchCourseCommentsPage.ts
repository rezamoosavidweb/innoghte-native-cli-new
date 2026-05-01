import { publicCommentsResponseSchema } from '@/domains/home/model/comments.schema';
import { getApiClient, parseJsonResponse } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import type { z } from 'zod';

/** Same contract as client-web `getPublicComments(page, per_page, course_id?, category_id?)`. */
export async function fetchCourseCommentsPage(
  page: number,
  perPage: number,
  courseId?: number,
  categoryId?: number,
): Promise<z.infer<typeof publicCommentsResponseSchema>> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  if (courseId !== undefined && courseId > 0) {
    params.append('course_id', String(courseId));
  }
  if (categoryId !== undefined && categoryId > 0) {
    params.append('category_id', String(categoryId));
  }
  const path = `${endpoints.public.comments}?${params.toString()}`;
  return parseJsonResponse(
    getApiClient().get(path),
    publicCommentsResponseSchema,
  );
}
