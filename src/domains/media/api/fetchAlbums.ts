import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import { normalizeListResponse } from '@/shared/infra/http/normalizeListResponse';
import { mapAlbumItem, type Album } from '@/domains/media/model/album.entities';

export async function fetchAlbums(): Promise<readonly Album[]> {
  const result = await parseJsonResponse<
    Record<string, unknown>[] | { data?: Record<string, unknown>[] }
  >(getApiClient().get(endpoints.public.albums.replace(/^\//, '')));
  return normalizeListResponse(result).map(mapAlbumItem);
}
