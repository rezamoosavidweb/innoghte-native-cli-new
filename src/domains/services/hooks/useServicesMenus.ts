import type { TFunction } from 'i18next';
import * as React from 'react';
import { SvgProps } from 'react-native-svg';

import AlbumIcon from '@/assets/icons/inn/album.svg';
import CourseIcon from '@/assets/icons/inn/course.svg';
import EventIcon from '@/assets/icons/inn/event.svg';
import LiveIcon from '@/assets/icons/inn/live.svg';
import SupportIcon from '@/assets/icons/inn/support-financial.svg';
import type { MenuSectionItem } from '@/ui/components/MenuSection';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';

type ServicesMenuRowConfig = {
  readonly id: string;
  readonly icon: React.FC<SvgProps>;
  readonly titleKey: 'courses' | 'albums' | 'live' | 'support' | 'events';
  readonly route: AppLeafRouteName;
};

const SERVICES_MENU: readonly ServicesMenuRowConfig[] = [
  {
    id: 'services-courses',
    icon: CourseIcon,
    titleKey: 'courses',
    route: 'Courses',
  },
  {
    id: 'services-albums',
    icon: AlbumIcon,
    titleKey: 'albums',
    route: 'Albums',
  },
  {
    id: 'services-live',
    icon: LiveIcon,
    titleKey: 'live',
    route: 'LiveMeetings',
  },
  {
    id: 'services-support',
    icon: SupportIcon,
    titleKey: 'support',
    route: 'SupportServices',
  },
  {
    id: 'services-events',
    icon: EventIcon,
    titleKey: 'events',
    route: 'Events',
  },
] as const;

function mapServicesMenuConfig(
  rows: readonly ServicesMenuRowConfig[],
  t: TFunction,
): MenuSectionItem[] {
  return rows.map(row => ({
    id: row.id,
    icon: row.icon,
    route: row.route,
    title: t(`screens.services.menu.${row.titleKey}`),
  }));
}

export function useServicesMenus(t: TFunction): MenuSectionItem[] {
  return React.useMemo(() => mapServicesMenuConfig(SERVICES_MENU, t), [t]);
}
