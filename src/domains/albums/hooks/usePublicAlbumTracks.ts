import { useQuery } from '@tanstack/react-query';

import {
  publicAlbumTracksKeys,
  type PublicAlbumTracksListFilters,
} from '@/domains/albums/model/queryKeys';
import { fetchPublicAlbumTracks } from '@/domains/albums/api';

const STALE_TIME_MS = 5 * 60 * 1000;

export function usePublicAlbumTracks(filters?: PublicAlbumTracksListFilters) {
  const { categoryId, page, perPage } = filters ?? {};
  return useQuery({
    queryKey: publicAlbumTracksKeys.list(filters),
    queryFn: () => fetchPublicAlbumTracks(categoryId, page, perPage),
    staleTime: STALE_TIME_MS,
  });
}
