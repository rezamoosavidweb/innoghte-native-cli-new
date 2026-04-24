import * as React from 'react';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { ScreenScaffold } from '@/components/ScreenScaffold';
import type { TabParamList } from '@/navigation/types';

type Props = BottomTabScreenProps<TabParamList, 'Notifications'>;

const NotificationsScreenComponent = (_props: Props) => {
  const { t } = useTranslation();

  return (
    <ScreenScaffold
      title={t('screens.notifications.title')}
      subtitle={t('screens.notifications.subtitle')}
    />
  );
};

export const NotificationsScreen = React.memo(NotificationsScreenComponent);
NotificationsScreen.displayName = 'NotificationsScreen';
