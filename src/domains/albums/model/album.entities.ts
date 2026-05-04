export type Album = {
  id: number;
  title_fa: string;
  package: number;
  price: number;
  /** Mirrors public course listing when album items expose `is_accessible`. */
  isAccessible: boolean;
  /** Mirrors `remain_capacity` when provided; default avoids false “full” state. */
  remainCapacity: number;
  itemsCount?: number;
  image_media: Array<{
    course_id: number;
    id: number;
    src: string;
    cover?: number;
  }>;
};

export function mapAlbumItem(item: Record<string, unknown>): Album {
  const rawRemain = item.remain_capacity;
  const remainCapacity =
    typeof rawRemain === 'number' && Number.isFinite(rawRemain)
      ? rawRemain
      : 1;

  const rawItemsCount =
    item.chapters_count ?? item.tracks_count ?? item.count_items ?? item.items_count;
  const itemsCount =
    typeof rawItemsCount === 'number' && Number.isFinite(rawItemsCount)
      ? rawItemsCount
      : undefined;

  return {
    id: Number(item.id ?? 0),
    title_fa: String(item.title_fa ?? ''),
    package: Number(item.package ?? 0),
    price: Number(item.price ?? 0),
    isAccessible: Boolean(item.is_accessible),
    remainCapacity,
    itemsCount,
    image_media: Array.isArray(item.image_media)
      ? item.image_media.map((media, index) => {
          const m = media as Record<string, unknown>;
          return {
            course_id: Number(m.course_id ?? item.id ?? 0),
            id: Number(m.id ?? index),
            src: String(m.src ?? ''),
            cover: typeof m.cover === 'number' ? m.cover : undefined,
          };
        })
      : [],
  };
}
