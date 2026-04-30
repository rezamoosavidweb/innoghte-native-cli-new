import * as React from 'react';

import { useCourses } from '@/domains/courses';

const HIDE_COURSE_IDS = new Set([99]);

const COURSE_CATEGORY_FILTERS = {
  categoryId: 1,
  page: undefined,
  perPage: undefined,
} as const;

const ALBUM_CATEGORY_FILTERS = {
  categoryId: 9,
  page: undefined,
  perPage: undefined,
} as const;

export function useGiveGiftCourses() {
  const coursesQuery = useCourses(COURSE_CATEGORY_FILTERS);
  const albumsQuery = useCourses(ALBUM_CATEGORY_FILTERS);

  const courseOptions = React.useMemo(() => {
    const list = coursesQuery.data ?? [];
    return list.filter(c => !HIDE_COURSE_IDS.has(c.id));
  }, [coursesQuery.data]);

  const albumOptions = React.useMemo(
    () => albumsQuery.data ?? [],
    [albumsQuery.data],
  );

  return {
    coursesQuery,
    albumsQuery,
    courseOptions,
    albumOptions,
  };
}
