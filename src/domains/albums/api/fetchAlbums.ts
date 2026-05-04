import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import { normalizeListResponse } from '@/shared/infra/http/normalizeListResponse';
import { mapAlbumItem, type Album } from '@/domains/albums/model/album.entities';
import { albumsListResponseSchema } from '@/domains/albums/model/schemas';

export async function fetchAlbums(): Promise<readonly Album[]> {
  const result = await parseJsonResponse(
    getApiClient().get(endpoints.public.albums),
    albumsListResponseSchema,
  );
  return normalizeListResponse(result).map(mapAlbumItem);
}
