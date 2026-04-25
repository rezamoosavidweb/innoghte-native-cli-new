import { mapAlbumItem, type Album } from '@/features/albums/types';
import { getAlbums } from '@/shared/api/modules/content.service';

export async function fetchAlbums(): Promise<readonly Album[]> {
  const items = await getAlbums();
  return items.map(mapAlbumItem);
}
