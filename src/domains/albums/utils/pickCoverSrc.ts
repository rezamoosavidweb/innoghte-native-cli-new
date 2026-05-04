import type { CatalogItemDetail } from '@/shared/catalog/model/catalogItemDetail.schema';

export function pickCoverSrc(item: CatalogItemDetail): string {
  const images = item.medias?.filter(m => m.type === 'image') ?? [];
  const cover = images.find(m => m.is_cover)?.src;
  return cover ?? images[0]?.src ?? '';
}
