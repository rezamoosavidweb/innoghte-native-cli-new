import { buildScrollMemoryKey, useAppInfiniteList } from '@/shared/lib/infiniteList';

import {
  fetchAlbumsPage,
  type FetchAlbumsPageResult,
} from '@/domains/albums/api/fetchAlbumsPage';
import type { Album } from '@/domains/albums/model';
import {
  albumsKeys,
  type AlbumsInfiniteListFilters,
} from '@/domains/albums/model/queryKeys';

const STALE_TIME_MS = 5 * 60 * 1000;
const DEFAULT_PER_PAGE = 15;

export function useInfiniteAlbums(filters?: AlbumsInfiniteListFilters) {
  const categoryId = filters?.categoryId;
  const perPage = filters?.perPage ?? DEFAULT_PER_PAGE;
  const queryKey = albumsKeys.infiniteList(filters);

  return useAppInfiniteList<
    Album,
    FetchAlbumsPageResult,
    number,
    ReturnType<typeof albumsKeys.infiniteList>
  >({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchAlbumsPage(categoryId, pageParam as number, perPage),
    initialPageParam: 1,
    staleTime: STALE_TIME_MS,
    scrollMemoryKey: buildScrollMemoryKey(queryKey),
  });
}
