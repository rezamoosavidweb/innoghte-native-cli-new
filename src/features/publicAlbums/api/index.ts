import type { PublicAlbumTrack } from '@/features/publicAlbums/types';
import { getCourses } from '@/shared/api/modules/content.service';

function mapPublicCourseToAlbumTrack(item: {
  id: number;
  title_fa: string;
  medias: Array<{ id: number; type: 'audio' | 'image' | 'video'; src: string }>;
  chapters: unknown[];
  duration: string | null;
}): PublicAlbumTrack {
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

export async function fetchPublicAlbumTracks(): Promise<
  readonly PublicAlbumTrack[]
> {
  const response = await getCourses();
  return (response.data ?? []).map(mapPublicCourseToAlbumTrack);
}
