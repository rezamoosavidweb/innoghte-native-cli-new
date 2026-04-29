import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';

/** Profile hub menu row — resolved titles + typed navigation targets. */
export type ProfileMenuListItem = {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly route: AppLeafRouteName;
};
