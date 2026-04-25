export type LiveMeetingType = {
  id: number;
  title_fa: string;
  package: number;
  price: number;
  image_media: Array<{
    course_id: number;
    id: number;
    src: string;
  }>;
};

export function mapLiveMeetingItem(item: Record<string, unknown>): LiveMeetingType {
  return {
    id: Number(item.id ?? 0),
    title_fa: String(item.title_fa ?? ''),
    package: Number(item.package ?? 0),
    price: Number(item.price ?? 0),
    image_media: Array.isArray(item.image_media)
      ? item.image_media.map((media, index) => {
          const m = media as Record<string, unknown>;
          return {
            course_id: Number(m.course_id ?? item.id ?? 0),
            id: Number(m.id ?? index),
            src: String(m.src ?? ''),
          };
        })
      : [],
  };
}
