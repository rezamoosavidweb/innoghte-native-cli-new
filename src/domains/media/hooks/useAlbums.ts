import { useQuery } from '@tanstack/react-query';

import { ALBUMS_QUERY_KEY } from '@/domains/media/model/queryKeys';
import { fetchAlbums } from '@/domains/media/api';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useAlbums() {
  return useQuery({
    queryKey: ALBUMS_QUERY_KEY,
    queryFn: fetchAlbums,
    staleTime: STALE_TIME_MS,
  });
}
