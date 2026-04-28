import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';

import type { PublicAlbumTrack } from '@/domains/media/model/publicAlbum.entities';
import { publicAlbumTracksResponseSchema } from '@/domains/media/model/schemas';

/**
 * Intentional duplicate of the public-courses list fetch (no import from
 * `domains/courses` — domains do not refer to each other).
 */
type PublicCourseListItem = {
  id: number;
  title_fa: string;
  medias: Array<{ id: number; type: 'audio' | 'image' | 'video'; src: string }>;
  chapters: unknown[];
  duration: string | null;
};

function mapPublicCourseToAlbumTrack(item: PublicCourseListItem): PublicAlbumTrack {
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

export async function fetchPublicAlbumTracks(): Promise<readonly PublicAlbumTrack[]> {
  const response = await parseJsonResponse(
    getApiClient().get(endpoints.public.courses),
    publicAlbumTracksResponseSchema,
  );
  const data = (response.data ?? []) as PublicCourseListItem[];
  return data.map(mapPublicCourseToAlbumTrack);
}
