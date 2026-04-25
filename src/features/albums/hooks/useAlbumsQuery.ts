import { useQuery } from '@tanstack/react-query';

import { fetchAlbums } from '@/features/albums/api';
import { ALBUMS_QUERY_KEY } from '@/features/albums/constants/queryKeys';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useAlbumsQuery() {
  return useQuery({
    queryKey: ALBUMS_QUERY_KEY,
    queryFn: fetchAlbums,
    staleTime: STALE_TIME_MS,
  });
}
