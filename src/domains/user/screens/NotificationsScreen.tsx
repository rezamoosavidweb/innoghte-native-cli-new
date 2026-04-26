import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { ScreenScaffold } from '@/ui/components/ScreenScaffold';

const NotificationsScreenComponent = () => {
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
