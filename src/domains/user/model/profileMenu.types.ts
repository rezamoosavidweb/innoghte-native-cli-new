import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';

/** Profile hub menu row — resolved titles + typed navigation targets. */
export type ProfileMenuListItem = {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly route: AppLeafRouteName;
};

/** Data-driven profile hub section (services, financial, experiences, support). */
export type ProfileScreenSection = Readonly<{
  key: string;
  title: string;
  items: readonly ProfileMenuListItem[];
}>;
