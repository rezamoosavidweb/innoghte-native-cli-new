import type { PublicCourseDto } from '@/domains/courses/model/courseApi.dto';

export type Course = {
  id: number;
  title_fa: string;
  points: number;
  price: number;
  package: number;
  count_chapters: number;
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

export function mapPublicCourseToCourseItem(item: PublicCourseDto): Course {
  const firstImage = item.medias.find(media => media.type === 'image');
  return {
    id: item.id,
    title_fa: item.title_fa,
    points: item.points,
    price: item.price,
    package: item.is_package ? 1 : 0,
    count_chapters: item.chapters?.length ?? 0,
    isAccessible: Boolean(item.is_accessible),
    remainCapacity:
      typeof item.remain_capacity === 'number' ? item.remain_capacity : 1,
    image_media: firstImage
      ? [{ course_id: item.id, id: firstImage.id, src: firstImage.src }]
      : [],
  };
}
