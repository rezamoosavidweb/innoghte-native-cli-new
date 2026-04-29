import { useQuery } from '@tanstack/react-query';

import { coursesKeys, type CoursesListFilters } from '@/domains/courses/model/queryKeys';
import { fetchCourses } from '@/domains/courses/api';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useCourses(filters?: CoursesListFilters) {
  const { categoryId, page, perPage } = filters ?? {};
  return useQuery({
    queryKey: coursesKeys.list(filters),
    queryFn: () => fetchCourses(categoryId, page, perPage),
    staleTime: STALE_TIME_MS,
  });
}
