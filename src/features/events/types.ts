export type EventType = {
  id: number;
  title_fa: string;
  state: string;
  price: number;
  remain_capacity: number;
  image_media: Array<{
    course_id: number;
    id: number;
    priority?: number;
    src: string;
  }>;
  event_detail?: {
    type?: string;
  };
};

export function mapEventItem(item: Record<string, unknown>): EventType {
  const eventDetail = (item.event_detail ?? {}) as Record<string, unknown>;

  return {
    id: Number(item.id ?? 0),
    title_fa: String(item.title_fa ?? ''),
    state: String(item.state ?? 'unknown'),
    price: Number(item.price ?? 0),
    remain_capacity: Number(item.remain_capacity ?? 0),
    image_media: Array.isArray(item.image_media)
      ? item.image_media.map((media, index) => {
          const m = media as Record<string, unknown>;
          return {
            course_id: Number(m.course_id ?? item.id ?? 0),
            id: Number(m.id ?? index),
            priority: typeof m.priority === 'number' ? m.priority : undefined,
            src: String(m.src ?? ''),
          };
        })
      : [],
    event_detail: {
      type: typeof eventDetail.type === 'string' ? eventDetail.type : undefined,
    },
  };
}
