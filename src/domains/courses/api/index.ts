export { getPublicCourses } from './fetchPublicCourses';

import {
  mapPublicCourseToCourseItem,
  type Course,
} from '../model/entities';
import { getPublicCourses } from './fetchPublicCourses';

import type { PaginationDto } from '@/shared/contracts/pagination';

/** One page for useInfiniteQuery — keeps pagination meta for `getNextPageParam`. */
export type FetchCoursesPageResult = {
  items: readonly Course[];
  pagination: PaginationDto;
};

export async function fetchCoursesPage(
  category_id?: number,
  page?: number,
  per_page?: number,
): Promise<FetchCoursesPageResult> {
  const response = await getPublicCourses(category_id, page, per_page);
  return {
    items: (response.data ?? []).map(mapPublicCourseToCourseItem),
    pagination: response.pagination,
  };
}

export async function fetchCourses(
  category_id?: number,
  page?: number,
  per_page?: number,
): Promise<readonly Course[]> {
  const { items } = await fetchCoursesPage(category_id, page, per_page);
  return items;
}
