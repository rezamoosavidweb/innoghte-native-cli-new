/** Distinct from courses query keys; avoids cache collisions with other lists. */
export const ALBUMS_QUERY_KEY = ['albums', 'catalog'] as const;

/** Filters for authenticated / catalog album infinite list (pagination in TanStack Query). */
export type AlbumsInfiniteListFilters = {
  categoryId?: number;
  perPage?: number;
};

export const albumsKeys = {
  all: ['albums'] as const,
  catalog: ALBUMS_QUERY_KEY,
  infiniteList: (filters?: AlbumsInfiniteListFilters) => {
    const f = filters ?? {};
    return [...albumsKeys.all, 'infiniteList', f.categoryId ?? null, f.perPage ?? null] as const;
  },
} as const;

export type PublicAlbumTracksListFilters = {
  categoryId?: number;
  page?: number;
  perPage?: number;
};

/** Filters for infinite public-album feed — cursor lives in TanStack Query, not the key. */
export type PublicAlbumsInfiniteListFilters = {
  categoryId?: number;
  perPage?: number;
};

export const publicAlbumInfiniteKeys = {
  all: ['publicAlbums', 'infiniteList'] as const,
  infiniteList: (filters?: PublicAlbumsInfiniteListFilters) => {
    const f = filters ?? {};
    return [...publicAlbumInfiniteKeys.all, f.categoryId ?? null, f.perPage ?? null] as const;
  },
} as const;

export const publicAlbumTracksKeys = {
  all: ['publicAlbums', 'tracks'] as const,
  list: (filters?: PublicAlbumTracksListFilters) => {
    const f = filters ?? {};
    return [...publicAlbumTracksKeys.all, f.categoryId ?? null, f.page ?? null, f.perPage ?? null] as const;
  },
} as const;

/** Default list key (no filters). */
export const PUBLIC_ALBUM_TRACKS_QUERY_KEY = publicAlbumTracksKeys.list();
