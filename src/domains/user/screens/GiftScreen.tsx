import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { ProfileMenuSection } from '@/domains/user/components/profile/ProfileMenuSection';
import { useGiftHubMenus } from '@/domains/user/hooks/useGiftHubMenus';
import {
  useProfileMenuStyles,
} from '@/domains/user/ui/profileScreen.styles';
import { navigateToAppLeaf } from '@/app/bridge/auth';
import type { AppLeafRouteName, DrawerParamList } from '@/shared/contracts/navigationApp';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { SectionDivider } from '@/ui/components/SectionDivider';
import { useSectionDividerStyles } from '@/ui/theme';

type Props = DrawerScreenProps<DrawerParamList, 'GiftScreen'>;

export const GiftScreen = React.memo(function GiftScreen(_props: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const navigation = useAppNavigation();
  const menuStyles = useProfileMenuStyles(colors);
  const dividerStyles = useSectionDividerStyles(colors, theme);

  const items = useGiftHubMenus(t);

  const onNavigate = React.useCallback(
    (route: AppLeafRouteName) => {
      navigateToAppLeaf(navigation, route);
    },
    [navigation],
  );

  return (
    <ScrollView
      contentContainerStyle={menuStyles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={menuStyles.loadedStack}>
        <View style={menuStyles.sectionSpacing}>
          <SectionDivider title={t('screens.gift.title')} styles={dividerStyles} />
        </View>
        <ProfileMenuSection
          items={items}
          menuStyles={menuStyles}
          onNavigate={onNavigate}
        />
      </View>
    </ScrollView>
  );
});
GiftScreen.displayName = 'GiftScreen';
