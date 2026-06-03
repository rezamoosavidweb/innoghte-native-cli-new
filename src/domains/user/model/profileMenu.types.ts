import type { MenuSectionItem } from '@/ui/components/MenuSection';

/** Data-driven profile hub section (services, financial, experiences, support). */
export type ProfileScreenSection = Readonly<{
  key: string;
  title: string;
  items: readonly MenuSectionItem[];
}>;
