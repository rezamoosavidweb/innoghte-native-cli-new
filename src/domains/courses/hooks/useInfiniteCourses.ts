import { useAppInfiniteList } from '@/shared/lib/infiniteList';

import {
  fetchCoursesPage,
  type FetchCoursesPageResult,
} from '@/domains/courses/api';
import type { Course } from '@/domains/courses/model/entities';
import {
  coursesKeys,
  type CoursesInfiniteListFilters,
} from '@/domains/courses/model/queryKeys';

const STALE_TIME_MS = 5 * 60 * 1000;
/** Default page size when `perPage` is omitted — explicit to avoid unintentional backend defaults per environment. */
const DEFAULT_PER_PAGE = 15;

function getCoursesNextPageParam(
  lastPage: FetchCoursesPageResult,
): number | undefined {
  const { current_page: curRaw, total_pages: totalRaw } = lastPage.pagination;
  const current = typeof curRaw === 'number' ? curRaw : Number(curRaw);
  const total = typeof totalRaw === 'number' ? totalRaw : Number(totalRaw);
  if (!Number.isFinite(current) || !Number.isFinite(total)) {
    return undefined;
  }
  if (total < 1) {
    return undefined;
  }
  if (current >= total) {
    return undefined;
  }
  return current + 1;
}

function buildCoursesScrollMemoryKey(
  filters?: CoursesInfiniteListFilters,
): string {
  const keyParts = coursesKeys.infiniteList(filters);
  return `scroll:list:${JSON.stringify(keyParts)}`;
}

/**
 * Infinite public courses feed — uses {@link useAppInfiniteList}.
 */
export function useInfiniteCourses(filters?: CoursesInfiniteListFilters) {
  const categoryId = filters?.categoryId;
  const perPage = filters?.perPage ?? DEFAULT_PER_PAGE;

  return useAppInfiniteList<
    Course,
    FetchCoursesPageResult,
    number,
    ReturnType<typeof coursesKeys.infiniteList>
  >({
    queryKey: coursesKeys.infiniteList(filters),
    queryFn: ({ pageParam }) =>
      fetchCoursesPage(categoryId, pageParam as number, perPage),
    initialPageParam: 1,
    getNextPageParam: (last) => getCoursesNextPageParam(last),
    staleTime: STALE_TIME_MS,
    scrollMemoryKey: buildCoursesScrollMemoryKey(filters),
  });
}
