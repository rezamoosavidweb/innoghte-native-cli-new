import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';
import { SvgProps } from 'react-native-svg';

/** Profile hub menu row — resolved titles + typed navigation targets. */
export type ProfileMenuListItem = {
  readonly id: string;
  readonly title: string;
  readonly icon: React.FC<SvgProps>;
  readonly route: AppLeafRouteName;
};

/** Data-driven profile hub section (services, financial, experiences, support). */
export type ProfileScreenSection = Readonly<{
  key: string;
  title: string;
  items: readonly ProfileMenuListItem[];
}>;
