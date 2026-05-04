import type { PublicCourseDto } from '@/domains/courses/model/courseApi.dto';
import { getPublicCourses } from '@/domains/courses/api/fetchPublicCourses';

import {
  mapPublicCourseListItemToAlbumTrack,
  type PublicCourseListItemLike,
} from '@/domains/albums/api/fetchPublicAlbumTracks';
import type { PublicAlbumTrack } from '@/domains/albums/model/publicAlbum.entities';

import type { PaginationDto } from '@/shared/contracts/pagination';

function publicCourseDtoToListLike(dto: PublicCourseDto): PublicCourseListItemLike {
  return {
    id: dto.id,
    title_fa: dto.title_fa,
    medias: dto.medias.map(media => ({
      id: media.id,
      type: media.type,
      src: media.src ?? media.url,
    })),
    chapters: dto.chapters ?? [],
    duration: dto.duration,
  };
}

/** One infinite-query page (`useAppInfiniteList` / `getNextPageParam`). */
export type FetchPublicAlbumsPageResult = {
  items: readonly PublicAlbumTrack[];
  pagination: PaginationDto;
};

/**
 * Paginated public album list backed by **`GET`** public courses with **`category_id`**
 * (same envelope as courses infinite).
 */
export async function fetchPublicAlbumsPage(
  category_id?: number,
  page?: number,
  per_page?: number,
): Promise<FetchPublicAlbumsPageResult> {
  const response = await getPublicCourses(category_id, page, per_page);
  const data = response.data ?? [];
  return {
    items: data.map(d =>
      mapPublicCourseListItemToAlbumTrack(publicCourseDtoToListLike(d)),
    ),
    pagination: response.pagination,
  };
}
