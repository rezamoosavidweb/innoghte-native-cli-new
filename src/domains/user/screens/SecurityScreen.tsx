import type { DrawerScreenProps } from '@react-navigation/drawer';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { ScreenScaffold } from '@/ui/components/ScreenScaffold';

type Props = DrawerScreenProps<DrawerParamList, 'Security'>;

const SecurityScreenComponent = (_props: Props) => {
  const { t } = useTranslation();

  return (
    <ScreenScaffold
      title={t('screens.security.title')}
      subtitle={t('screens.security.subtitle')}
    />
  );
};

export const SecurityScreen = React.memo(SecurityScreenComponent);
SecurityScreen.displayName = 'SecurityScreen';
