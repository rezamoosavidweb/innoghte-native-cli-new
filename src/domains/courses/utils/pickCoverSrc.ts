import type { PublicCourseDetailData } from '@/domains/courses/model/courseDetail.schema';

export function pickCoverSrc(course: PublicCourseDetailData): string {
  const images = course.medias?.filter(m => m.type === 'image') ?? [];
  const cover = images.find(m => m.is_cover)?.src;
  return cover ?? images[0]?.src ?? '';
}
