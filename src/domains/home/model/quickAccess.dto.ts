/**
 * Wire-format quick-access entry returned by `/api/v1/public/quick-access`.
 * Fields mirror the web client's `QuickAccessDto` exactly.
 */
export type QuickAccessDto = {
  id: number;
  title_fa: string;
  image: string;
  full_info: string;
  url: string;
  is_show: boolean;
  is_show_fa: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type QuickAccessResponse = {
  data: QuickAccessDto[];
  message?: string;
};

/** UI-shaped item consumed by `QuickAccess.tsx` and the `Swiper`. */
export type QuickAccessItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
};

export function mapQuickAccessDto(dto: QuickAccessDto): QuickAccessItem {
  return {
    id: String(dto.id),
    title: dto.title_fa ?? '',
    description: dto.full_info ?? '',
    imageUrl: dto.image ?? '',
    url: dto.url ?? '',
  };
}
