import * as React from 'react';

import { useCatalogItems } from '@/domains/courses';

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

const ROOYE_KHAT_CATEGORY_FILTERS = {
  categoryId: 8,
  page: undefined,
  perPage: undefined,
} as const;

const AUDIO_BOOK_CATEGORY_FILTERS = {
  categoryId: 11,
  page: undefined,
  perPage: undefined,
} as const;

export function useGiveGiftCourses() {
  const coursesQuery = useCatalogItems(COURSE_CATEGORY_FILTERS);
  const albumsQuery = useCatalogItems(ALBUM_CATEGORY_FILTERS);
  const rooyeKhatsQuery = useCatalogItems(ROOYE_KHAT_CATEGORY_FILTERS);
  const audioBooksQuery = useCatalogItems(AUDIO_BOOK_CATEGORY_FILTERS);

  const courseOptions = React.useMemo(() => {
    const list = coursesQuery.data ?? [];
    return list.filter(c => !HIDE_COURSE_IDS.has(c.id));
  }, [coursesQuery.data]);

  const albumOptions = React.useMemo(
    () => albumsQuery.data ?? [],
    [albumsQuery.data],
  );

  const rooyeKhatOptions = React.useMemo(
    () => rooyeKhatsQuery.data ?? [],
    [rooyeKhatsQuery.data],
  );

  const audioBookOptions = React.useMemo(
    () => audioBooksQuery.data ?? [],
    [audioBooksQuery.data],
  );

  return {
    coursesQuery,
    albumsQuery,
    rooyeKhatsQuery,
    audioBooksQuery,
    courseOptions,
    albumOptions,
    rooyeKhatOptions,
    audioBookOptions,
  };
}
