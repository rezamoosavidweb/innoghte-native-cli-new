import { useQuery } from '@tanstack/react-query';

import { fetchCourses } from '../api/fetchCourses';
import { COURSES_QUERY_KEY } from '../constants/queryKeys';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useCoursesQuery() {
  return useQuery({
    queryKey: COURSES_QUERY_KEY,
    queryFn: fetchCourses,
    staleTime: STALE_TIME_MS,
  });
}
