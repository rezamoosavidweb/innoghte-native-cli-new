import { useQuery } from '@tanstack/react-query';

import { PUBLIC_ALBUM_TRACKS_QUERY_KEY } from '@/shared/infra/query/queryKeys';
import { fetchPublicAlbumTracks } from '@/domains/media/api';

const STALE_TIME_MS = 5 * 60 * 1000;

export function usePublicAlbumTracks() {
  return useQuery({
    queryKey: PUBLIC_ALBUM_TRACKS_QUERY_KEY,
    queryFn: fetchPublicAlbumTracks,
    staleTime: STALE_TIME_MS,
  });
}
