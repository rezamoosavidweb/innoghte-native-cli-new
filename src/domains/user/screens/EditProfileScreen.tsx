import type { DrawerScreenProps } from '@react-navigation/drawer';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { ScreenScaffold } from '@/ui/components/ScreenScaffold';

type Props = DrawerScreenProps<DrawerParamList, 'EditProfile'>;

const EditProfileScreenComponent = (_props: Props) => {
  const { t } = useTranslation();

  return (
    <ScreenScaffold
      title={t('screens.editProfile.title')}
      subtitle={t('screens.editProfile.subtitle')}
    />
  );
};

export const EditProfileScreen = React.memo(EditProfileScreenComponent);
EditProfileScreen.displayName = 'EditProfileScreen';
