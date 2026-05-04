import {
  buildPublicCoursesQuerySuffix,
  endpoints,
  getApiClient,
  parseJsonResponse,
} from '@/shared/infra/http';
import { normalizeListResponse } from '@/shared/infra/http/normalizeListResponse';
import type { PaginationDto } from '@/shared/contracts/pagination';
import { mapAlbumItem, type Album } from '@/domains/albums/model/album.entities';
import { albumsCatalogPageResponseSchema } from '@/domains/albums/model/schemas';

export type FetchAlbumsPageResult = {
  items: readonly Album[];
  pagination: PaginationDto;
};

function toPaginationDto(
  record: Record<string, unknown> | undefined,
  pageParam: number,
): PaginationDto {
  const currentRaw = record?.current_page ?? pageParam;
  const totalPagesRaw = record?.total_pages ?? 1;
  const perPageRaw = record?.per_page ?? 15;
  const totalItemsRaw = record?.total_items ?? record?.total ?? 0;

  const current_page =
    typeof currentRaw === 'number' && Number.isFinite(currentRaw)
      ? currentRaw
      : Number(currentRaw) || pageParam;
  const total_pages =
    typeof totalPagesRaw === 'number' && Number.isFinite(totalPagesRaw)
      ? totalPagesRaw
      : Number(totalPagesRaw) || 1;

  return {
    current_page,
    total_pages: total_pages < 1 ? 1 : total_pages,
    fist: String(record?.fist ?? ''),
    last: String(record?.last ?? ''),
    next: String(record?.next ?? ''),
    per_page:
      typeof perPageRaw === 'number' && Number.isFinite(perPageRaw)
        ? perPageRaw
        : Number(perPageRaw) || 15,
    prev: String(record?.prev ?? ''),
    total_items:
      typeof totalItemsRaw === 'number' && Number.isFinite(totalItemsRaw)
        ? totalItemsRaw
        : Number(totalItemsRaw) || 0,
  };
}

export async function fetchAlbumsPage(
  category_id?: number,
  page?: number,
  per_page?: number,
): Promise<FetchAlbumsPageResult> {
  const path = `${endpoints.public.albums}${buildPublicCoursesQuerySuffix({
    category_id,
    page,
    per_page,
  })}`;

  const result = await parseJsonResponse(
    getApiClient().get(path),
    albumsCatalogPageResponseSchema,
  );

  const pageParam = typeof page === 'number' && page > 0 ? page : 1;

  if (Array.isArray(result)) {
    return {
      items: result.map(raw => mapAlbumItem(raw as Record<string, unknown>)),
      pagination: toPaginationDto(undefined, pageParam),
    };
  }

  const items = normalizeListResponse(result).map(raw =>
    mapAlbumItem(raw as Record<string, unknown>),
  );
  const pagination = toPaginationDto(
    typeof result === 'object' && result && 'pagination' in result
      ? (result as { pagination?: Record<string, unknown> }).pagination
      : undefined,
    pageParam,
  );

  return { items, pagination };
}
