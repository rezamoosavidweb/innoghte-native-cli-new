import { useQuery } from '@tanstack/react-query';

import { fetchCourseCommentsPage } from '@/domains/courses/api/fetchCourseCommentsPage';
import { coursesKeys } from '@/domains/courses/model/queryKeys';

const STALE_TIME_MS = 2 * 60 * 1000;

export function useCourseCommentsPage(
  page: number,
  perPage: number,
  courseId?: number,
  categoryId?: number,
) {
  return useQuery({
    queryKey: coursesKeys.commentsPage(courseId, categoryId, page, perPage),
    queryFn: () =>
      fetchCourseCommentsPage(page, perPage, courseId, categoryId),
    staleTime: STALE_TIME_MS,
  });
}
