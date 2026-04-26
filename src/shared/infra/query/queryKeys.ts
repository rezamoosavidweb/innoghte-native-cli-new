export const AUTH_USER_QUERY_KEY = ['auth', 'user'] as const;

export const COURSES_QUERY_KEY = ['courses'] as const;

/** Distinct from courses query keys; avoids cache collisions with other lists. */
export const ALBUMS_QUERY_KEY = ['albums', 'catalog'] as const;

export const PUBLIC_ALBUM_TRACKS_QUERY_KEY = ['publicAlbums', 'tracks'] as const;

export const EVENTS_QUERY_KEY = ['events', 'list'] as const;

export const LIVE_MEETINGS_QUERY_KEY = ['liveMeetings', 'list'] as const;
