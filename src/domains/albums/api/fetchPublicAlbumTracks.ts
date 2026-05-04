import {
  buildPublicCoursesQuerySuffix,
  getApiClient,
  parseJsonResponse,
} from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';

import type { PublicAlbumTrack } from '@/domains/albums/model/publicAlbum.entities';
import { publicAlbumTracksResponseSchema } from '@/domains/albums/model/schemas';

/** Normalized subset of public-course payloads used for album-track cards (single API source). */
export type PublicCourseListItemLike = {
  id: number;
  title_fa: string;
  medias: Array<{ id: number; type: 'audio' | 'image' | 'video'; src: string }>;
  chapters: unknown[];
  duration: string | null;
};

export function mapPublicCourseListItemToAlbumTrack(
  item: PublicCourseListItemLike,
): PublicAlbumTrack {
  const isPublicAlbumMedia = (
    media: { id: number; type: 'audio' | 'image' | 'video'; src: string },
  ): media is { id: number; type: 'audio' | 'image'; src: string } =>
    media.type === 'image' || media.type === 'audio';

  return {
    id: item.id,
    title_fa: item.title_fa,
    chapters_count: Array.isArray(item.chapters) ? item.chapters.length : 0,
    duration: item.duration ?? '-',
    medias: item.medias
      .filter(isPublicAlbumMedia)
      .map(media => ({
        id: media.id,
        type: media.type,
        src: media.src,
      })),
  };
}

/** Same signature as client-web `getPublicCourses` (category filters list type). */
export async function fetchPublicAlbumTracks(
  category_id?: number,
  page?: number,
  per_page?: number,
): Promise<readonly PublicAlbumTrack[]> {
  const path = `${endpoints.public.courses}${buildPublicCoursesQuerySuffix({
    category_id,
    page,
    per_page,
  })}`;
  const response = await parseJsonResponse(
    getApiClient().get(path),
    publicAlbumTracksResponseSchema,
  );
  const data = (response.data ?? []) as PublicCourseListItemLike[];
  return data.map(mapPublicCourseListItemToAlbumTrack);
}
