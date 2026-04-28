import { useQuery } from '@tanstack/react-query';

import { coursesKeys } from '@/domains/courses/model/queryKeys';
import { fetchCourses } from '@/domains/courses/api';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useCourses() {
  return useQuery({
    queryKey: coursesKeys.list(),
    queryFn: fetchCourses,
    staleTime: STALE_TIME_MS,
  });
}
