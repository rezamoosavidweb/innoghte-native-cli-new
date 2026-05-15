import type { TFunction } from 'i18next';
import * as React from 'react';

import type { ProfileMenuListItem } from '@/domains/user/model/profileMenu.types';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';
import { SvgProps } from 'react-native-svg';
import CoursesIcon from '@/assets/icons/school.svg';
import AlbumIcon from '@/assets/icons/headphone.svg';

export type { ProfileMenuListItem } from '@/domains/user/model/profileMenu.types';

export type ProfileMenuRowConfig = {
  readonly id: string;
  readonly icon: React.FC<SvgProps>;
  readonly titleKey:
    | 'myCourses'
    | 'myAlbums'
    | 'meditations'
    | 'readings'
    | 'writings'
    | 'listenings';
  readonly route: AppLeafRouteName;
};

const PROFILE_ACTION_MENU: readonly ProfileMenuRowConfig[] = [
  {
    id: 'my-courses',
    icon: CoursesIcon,
    titleKey: 'myCourses',
    route: 'Courses',
  },
  { id: 'my-albums', icon: AlbumIcon, titleKey: 'myAlbums', route: 'Albums' },
] as const;

const PROFILE_EXPERIENCES_MENU: readonly ProfileMenuRowConfig[] = [
  {
    id: 'meditations',
    icon: CoursesIcon,
    titleKey: 'meditations',
    route: 'Meditation',
  },
  { id: 'readings', icon: CoursesIcon, titleKey: 'readings', route: 'Reading' },
  { id: 'writings', icon: CoursesIcon, titleKey: 'writings', route: 'Writing' },
  {
    id: 'listenings',
    icon: CoursesIcon,
    titleKey: 'listenings',
    route: 'Listening',
  },
] as const;

function mapMenuConfig(
  rows: readonly ProfileMenuRowConfig[],
  t: TFunction,
): ProfileMenuListItem[] {
  return rows.map(row => ({
    id: row.id,
    icon: row.icon,
    route: row.route,
    title: t(`screens.profile.menu.${row.titleKey}`),
  }));
}

export function useProfileMenus(t: TFunction) {
  return React.useMemo(
    () => ({
      actionItems: mapMenuConfig(PROFILE_ACTION_MENU, t),
      experienceItems: mapMenuConfig(PROFILE_EXPERIENCES_MENU, t),
    }),
    [t],
  );
}
