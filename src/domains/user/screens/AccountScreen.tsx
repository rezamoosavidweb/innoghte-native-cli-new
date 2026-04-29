import type { DrawerScreenProps } from '@react-navigation/drawer';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { ScreenScaffold } from '@/ui/components/ScreenScaffold';

type Props = DrawerScreenProps<DrawerParamList, 'Account'>;

const AccountScreenComponent = (_props: Props) => {
  const { t } = useTranslation();

  return (
    <ScreenScaffold
      title={t('screens.account.title')}
      subtitle={t('screens.account.subtitle')}
    />
  );
};

export const AccountScreen = React.memo(AccountScreenComponent);
AccountScreen.displayName = 'AccountScreen';
