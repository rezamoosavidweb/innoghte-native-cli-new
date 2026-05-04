import { useQuery } from '@tanstack/react-query';

import { ALBUMS_QUERY_KEY } from '@/domains/albums/model/queryKeys';
import { fetchAlbums } from '@/domains/albums/api';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useAlbums() {
  return useQuery({
    queryKey: ALBUMS_QUERY_KEY,
    queryFn: fetchAlbums,
    staleTime: STALE_TIME_MS,
  });
}
