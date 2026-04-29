/**
 * Mirrors `getPublicCourses` query construction in client-web
 * (`client-web/src/share/services/index.ts`).
 */
export type PublicCoursesQueryParams = {
  category_id?: number;
  page?: number;
  per_page?: number;
};

export function buildPublicCoursesQuerySuffix(params: PublicCoursesQueryParams): string {
  const search = new URLSearchParams();

  if (params.category_id !== undefined) {
    search.append('category_id', String(params.category_id));
  }
  if (params.page !== undefined) {
    search.append('page', String(params.page));
  }
  if (params.per_page !== undefined) {
    search.append('per_page', String(params.per_page));
  }

  const qs = search.toString();
  return qs.length > 0 ? `?${qs}` : '';
}
