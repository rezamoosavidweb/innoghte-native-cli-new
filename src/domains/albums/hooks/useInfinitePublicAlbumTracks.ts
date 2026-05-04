import { useAppInfiniteList } from '@/shared/lib/infiniteList';

import {
  fetchPublicAlbumsPage,
  type FetchPublicAlbumsPageResult,
} from '@/domains/albums/api';
import type { PublicAlbumTrack } from '@/domains/albums/model/publicAlbum.entities';
import {
  publicAlbumInfiniteKeys,
  type PublicAlbumsInfiniteListFilters,
} from '@/domains/albums/model/queryKeys';

const STALE_TIME_MS = 5 * 60 * 1000;
const DEFAULT_PER_PAGE = 15;

function buildPublicAlbumsScrollMemoryKey(filters?: PublicAlbumsInfiniteListFilters): string {
  const keyParts = publicAlbumInfiniteKeys.infiniteList(filters);
  return `scroll:list:${JSON.stringify(keyParts)}`;
}

function getAlbumsNextPageParam(
  lastPage: FetchPublicAlbumsPageResult,
): number | undefined {
  const { current_page: curRaw, total_pages: totalRaw } = lastPage.pagination;
  const current = typeof curRaw === 'number' ? curRaw : Number(curRaw);
  const total = typeof totalRaw === 'number' ? totalRaw : Number(totalRaw);
  if (!Number.isFinite(current) || !Number.isFinite(total)) {
    return undefined;
  }
  if (total < 1) {
    return undefined;
  }
  if (current >= total) {
    return undefined;
  }
  return current + 1;
}

/**
 * Infinite public albums feed (`category_id` on **`/public/courses`**), album-track card mapping.
 */
export function useInfinitePublicAlbumTracks(filters?: PublicAlbumsInfiniteListFilters) {
  const categoryId = filters?.categoryId;
  const perPage = filters?.perPage ?? DEFAULT_PER_PAGE;

  return useAppInfiniteList<
    PublicAlbumTrack,
    FetchPublicAlbumsPageResult,
    number,
    ReturnType<typeof publicAlbumInfiniteKeys.infiniteList>
  >({
    queryKey: publicAlbumInfiniteKeys.infiniteList(filters),
    queryFn: ({ pageParam }) =>
      fetchPublicAlbumsPage(categoryId, pageParam as number, perPage),
    initialPageParam: 1,
    getNextPageParam: last => getAlbumsNextPageParam(last),
    staleTime: STALE_TIME_MS,
    scrollMemoryKey: buildPublicAlbumsScrollMemoryKey(filters),
  });
}
