import type { CatalogItemDto } from '@/shared/catalog/model/catalogApi.dto';
import type { MediaDto } from '@/shared/contracts/media';

export type CatalogItem = {
  id: number;
  title: string | null;
  title_fa: string;
  author: string | null;
  fromAlbum: string | null;
  tags: string | null;
  shortInfo: string | null;
  fullInfo: string | null;
  medias: MediaDto[];
  points: number;
  price: number;
  discountPrice: number;
  package: number;
  /** Number of sub-items (chapters for courses, tracks for albums). */
  itemsCount: number;
  /** User already owns / can access — matches API `is_accessible`. */
  isAccessible: boolean;
  /** When `0`, capacity is full (matches API `remain_capacity`). */
  remainCapacity: number;
  image_media: Array<{
    course_id: number;
    id: number;
    src: string;
  }>;
};

export function mapCatalogItemDtoToCatalogItem(item: CatalogItemDto): CatalogItem {
  const firstImage = item.medias.find(media => media.type === 'image');

  return {
    id: item.id,
    title: item.title,
    title_fa: item.title_fa,
    author: item.author,
    fromAlbum: item.from_album,
    tags: item.tags,
    shortInfo: item.short_info,
    fullInfo: item.full_info,
    medias: item.medias ?? [],
    points: item.points,
    price: item.price,
    discountPrice: item.discount_price ?? item.price,
    package: item.is_package ? 1 : 0,
    itemsCount: item.chapters?.length ?? 0,
    isAccessible: Boolean(item.is_accessible),
    remainCapacity:
      typeof item.remain_capacity === 'number' ? item.remain_capacity : 1,
    image_media: firstImage
      ? [{ course_id: item.id, id: firstImage.id, src: firstImage.src }]
      : [],
  };
}
