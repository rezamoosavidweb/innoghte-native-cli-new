import * as React from 'react';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';

import { ScreenScaffold } from '@/ui/components/ScreenScaffold';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';

type Props = DrawerScreenProps<DrawerParamList, 'Help'>;

const HelpScreenComponent = (_props: Props) => {
  const { t } = useTranslation();

  return (
    <ScreenScaffold
      title={t('screens.help.title')}
      subtitle={t('screens.help.subtitle')}
    />
  );
};

export const HelpScreen = React.memo(HelpScreenComponent);
HelpScreen.displayName = 'HelpScreen';
