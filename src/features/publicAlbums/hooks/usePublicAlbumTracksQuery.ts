import { useQuery } from '@tanstack/react-query';

import { fetchPublicAlbumTracks } from '@/features/publicAlbums/api';
import { PUBLIC_ALBUM_TRACKS_QUERY_KEY } from '@/features/publicAlbums/constants/queryKeys';

const STALE_TIME_MS = 5 * 60 * 1000;

export function usePublicAlbumTracksQuery() {
  return useQuery({
    queryKey: PUBLIC_ALBUM_TRACKS_QUERY_KEY,
    queryFn: fetchPublicAlbumTracks,
    staleTime: STALE_TIME_MS,
  });
}
