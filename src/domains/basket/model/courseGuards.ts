export type CourseLike = {
  id?: number;
  title_fa?: string;
  price?: number;
  discount_price?: number | null;
  is_accessible?: boolean;
  medias?: { type?: string; src?: string }[];
};

export function asCourseLike(course: unknown): CourseLike | null {
  if (!course || typeof course !== 'object') {
    return null;
  }
  return course as CourseLike;
}

export function coursePrimaryImageSrc(course: unknown): string {
  const c = asCourseLike(course);
  const images = c?.medias?.filter(m => m?.type === 'image');
  return images?.[0]?.src ?? '';
}
