import type { TFunction } from 'i18next';
import * as React from 'react';

import AlbumIcon from '@/assets/icons/inn/album.svg';
import CourseIcon from '@/assets/icons/inn/course.svg';
import ListeningIcon from '@/assets/icons/inn/listening.svg';
import LiveIcon from '@/assets/icons/inn/live.svg';
import MeditationIcon from '@/assets/icons/inn/meditation.svg';
import ReadingIcon from '@/assets/icons/inn/reading.svg';
import WritingIcon from '@/assets/icons/inn/writing.svg';
import type { MenuSectionItem } from '@/ui/components/MenuSection';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';
import { SvgProps } from 'react-native-svg';

export type ProfileMenuRowConfig = {
  readonly id: string;
  readonly icon: React.FC<SvgProps>;
  readonly titleKey:
    | 'myCourses'
    | 'myAlbums'
    | 'myLiveMeetings'
    | 'audioBooks'
    | 'meditations'
    | 'readings'
    | 'writings'
    | 'listenings';
  readonly route: AppLeafRouteName;
};

const PROFILE_ACTION_MENU: readonly ProfileMenuRowConfig[] = [
  {
    id: 'my-courses',
    icon: CourseIcon,
    titleKey: 'myCourses',
    route: 'Courses',
  },
  { id: 'my-albums', icon: AlbumIcon, titleKey: 'myAlbums', route: 'Albums' },
  {
    id: 'my-live-meetings',
    icon: LiveIcon,
    titleKey: 'myLiveMeetings',
    route: 'LiveMeetings',
  },
  {
    id: 'audio-books',
    icon: ReadingIcon,
    titleKey: 'audioBooks',
    route: 'AudioBooks',
  },
] as const;

const PROFILE_EXPERIENCES_MENU: readonly ProfileMenuRowConfig[] = [
  {
    id: 'meditations',
    icon: MeditationIcon,
    titleKey: 'meditations',
    route: 'Meditation',
  },
  { id: 'readings', icon: ReadingIcon, titleKey: 'readings', route: 'Reading' },
  { id: 'writings', icon: WritingIcon, titleKey: 'writings', route: 'Writing' },
  {
    id: 'listenings',
    icon: ListeningIcon,
    titleKey: 'listenings',
    route: 'Listening',
  },
] as const;

function mapMenuConfig(
  rows: readonly ProfileMenuRowConfig[],
  t: TFunction,
): MenuSectionItem[] {
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
