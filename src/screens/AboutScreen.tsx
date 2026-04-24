import * as React from 'react';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';

import { ScreenScaffold } from '@/components/ScreenScaffold';
import type { DrawerParamList } from '@/navigation/types';

type Props = DrawerScreenProps<DrawerParamList, 'About'>;

const AboutScreenComponent = (_props: Props) => {
  const { t } = useTranslation();

  return (
    <ScreenScaffold
      title={t('screens.about.title')}
      subtitle={t('screens.about.subtitle')}
    />
  );
};

export const AboutScreen = React.memo(AboutScreenComponent);
AboutScreen.displayName = 'AboutScreen';
