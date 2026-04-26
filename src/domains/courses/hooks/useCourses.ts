import { useQuery } from '@tanstack/react-query';

import { COURSES_QUERY_KEY } from '@/shared/infra/query/queryKeys';
import { fetchCourses } from '@/domains/courses/api';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useCourses() {
  return useQuery({
    queryKey: COURSES_QUERY_KEY,
    queryFn: fetchCourses,
    staleTime: STALE_TIME_MS,
  });
}
