import { useQuery } from '@tanstack/react-query';

import { fetchPublicCourseDetail } from '@/domains/courses/api/fetchPublicCourseDetail';
import { coursesKeys } from '@/domains/courses/model/queryKeys';

const STALE_TIME_MS = 2 * 60 * 1000;

/** Mirrors web dashboard `useAuthQuery({ queryKey: ['course', id], ... })` — detail requires ownership server-side fields via same public endpoint when authorized. */
export function usePublicCourseDetail(courseId: number | undefined) {
  const enabled = typeof courseId === 'number' && courseId > 0;

  return useQuery({
    queryKey: enabled
      ? coursesKeys.detail(courseId as number)
      : [...coursesKeys.all, 'detail', 'skipped'] as const,
    queryFn: () => fetchPublicCourseDetail(courseId as number),
    enabled,
    staleTime: STALE_TIME_MS,
  });
}
