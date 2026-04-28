import { z } from 'zod';

const albumItemSchema = z.record(z.string(), z.unknown());

/** Permissive envelope — full item shape is normalized by `mapAlbumItem`. */
export const albumsListResponseSchema = z.union([
  z.array(albumItemSchema),
  z
    .object({
      data: z.array(albumItemSchema).optional(),
    })
    .passthrough(),
]);

export type AlbumsListResponse = z.infer<typeof albumsListResponseSchema>;

const publicCourseMediaSchema = z
  .object({
    id: z.number(),
    type: z.enum(['audio', 'image', 'video']),
    src: z.string(),
  })
  .passthrough();

const publicCourseListItemSchema = z
  .object({
    id: z.number(),
    title_fa: z.string(),
    medias: z.array(publicCourseMediaSchema),
    chapters: z.array(z.unknown()),
    duration: z.string().nullable(),
  })
  .passthrough();

/** Public-courses response reused as the source for public-album tracks. */
export const publicAlbumTracksResponseSchema = z
  .object({
    data: z.array(publicCourseListItemSchema).optional(),
  })
  .passthrough();

export type PublicAlbumTracksResponse = z.infer<typeof publicAlbumTracksResponseSchema>;
