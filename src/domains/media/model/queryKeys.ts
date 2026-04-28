/** Distinct from courses query keys; avoids cache collisions with other lists. */
export const ALBUMS_QUERY_KEY = ['albums', 'catalog'] as const;

export const PUBLIC_ALBUM_TRACKS_QUERY_KEY = ['publicAlbums', 'tracks'] as const;
