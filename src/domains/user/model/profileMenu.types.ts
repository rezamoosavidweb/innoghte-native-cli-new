import type { MenuSectionItem } from '@/ui/components/MenuSection';

/**
 * Profile hub menu row — resolved titles + typed navigation targets.
 *
 * @deprecated Alias of {@link MenuSectionItem} from `@/ui/components/MenuSection`.
 * Prefer importing `MenuSectionItem` directly.
 */
export type ProfileMenuListItem = MenuSectionItem;

/** Data-driven profile hub section (services, financial, experiences, support). */
export type ProfileScreenSection = Readonly<{
  key: string;
  title: string;
  items: readonly ProfileMenuListItem[];
}>;
