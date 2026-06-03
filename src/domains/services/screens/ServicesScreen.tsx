import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { navigateToAppLeaf } from '@/app/bridge/auth';
import { createProfileMenuStyles } from '@/domains/user/ui/profileScreen.styles';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { MenuSection } from '@/ui/components/MenuSection';

import { useServicesMenus } from '../hooks/useServicesMenus';

const ServicesScreenComponent = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useAppNavigation();

  const menuStyles = React.useMemo(
    () => createProfileMenuStyles(colors),
    [colors],
  );
  const items = useServicesMenus(t);

  const onNavigate = React.useCallback(
    (route: AppLeafRouteName) => {
      navigateToAppLeaf(navigation, route);
    },
    [navigation],
  );

  return (
    <ScrollView contentContainerStyle={menuStyles.scrollContent}>
      <MenuSection
        items={items}
        styles={menuStyles}
        onNavigate={onNavigate}
      />
    </ScrollView>
  );
};

export const ServicesScreen = React.memo(ServicesScreenComponent);
ServicesScreen.displayName = 'ServicesScreen';
