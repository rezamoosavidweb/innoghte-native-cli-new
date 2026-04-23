import * as React from 'react';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { ScreenScaffold } from '../components/ScreenScaffold';
import type { TabParamList } from '../navigation/types';

type Props = BottomTabScreenProps<TabParamList, 'Profile'>;

const ProfileScreenComponent = ({ route }: Props) => {
  const userId = route.params?.userId;
  const { t } = useTranslation();

  const subtitle = userId
    ? t('screens.profile.subtitleWithUser', { userId })
    : t('screens.profile.subtitleDefault');

  return (
    <ScreenScaffold title={t('screens.profile.title')} subtitle={subtitle} />
  );
};

export const ProfileScreen = React.memo(ProfileScreenComponent);
ProfileScreen.displayName = 'ProfileScreen';
