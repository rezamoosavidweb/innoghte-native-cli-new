import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CommonActions,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { navigateToAppLeaf } from '@/app/bridge/auth';
import { useCurrentUser } from '@/domains/auth/hooks/useCurrentUser';
import { ProfileContent } from '@/domains/user/components/profile/ProfileContent';
import type { ProfileShortcutRoute } from '@/domains/user/components/profile/ProfileShortcutButtons';
import { useProfileDerivedState } from '@/domains/user/hooks/useProfileDerivedState';
import { useProfileFinancialMenus } from '@/domains/user/hooks/useProfileFinancialMenus';
import { useProfileMenus } from '@/domains/user/hooks/useProfileMenus';
import { useProfileSupportMenus } from '@/domains/user/hooks/useProfileSupportMenus';
import {
  createProfileHeaderStyles,
  createProfileMenuStyles,
  createProfileShellStyles,
} from '@/domains/user/ui/profileScreen.styles';
import {
  createScreenScaffoldStyles,
  createSectionDividerStyles,
} from '@/ui/theme';
import type { AppLeafRouteName, TabParamList } from '@/shared/contracts/navigationApp';
import type { VerifyChannel } from '@/shared/contracts/verification';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';

type Props = BottomTabScreenProps<TabParamList, 'Profile'>;

const ProfileScreenComponent = (_props: Props) => {
  const theme = useTheme();
  const { colors } = theme;
  const { t } = useTranslation();
  const navigation = useAppNavigation();

  const scaffoldStyles = createScreenScaffoldStyles(colors);
  const shellStyles = createProfileShellStyles(colors, theme);
  const headerStyles = createProfileHeaderStyles(colors, theme);
  const menuStyles = createProfileMenuStyles(colors);
  const dividerStyles = createSectionDividerStyles(colors, theme);

  const { actionItems, experienceItems } = useProfileMenus(t);
  const financialMenuItems = useProfileFinancialMenus(t);
  const supportMenuItems = useProfileSupportMenus(t);

  const {
    data: userRes,
    isPending,
    isError,
    refetch,
    isFetching,
  } = useCurrentUser();
  const user = userRes?.data;

  const { profileUser, initials, avatarUri } = useProfileDerivedState(
    user,
    t('drawer.user.fallbackName'),
  );

  const shellConfig = React.useMemo(
    () => ({
      shellStyles,
      scaffoldSubtitleStyle: scaffoldStyles.subtitle,
      scaffoldSectionTitleStyle: scaffoldStyles.sectionTitle,
      activityColor: colors.text,
      loadingMessage: t('screens.profile.loading'),
    }),
    [
      colors.text,
      scaffoldStyles.sectionTitle,
      scaffoldStyles.subtitle,
      shellStyles,
      t,
    ],
  );

  const menuConfig = React.useMemo(
    () => ({
      headerStyles,
      menuStyles,
      dividerStyles,
      actionMenuItems: actionItems,
      financialMenuItems,
      experienceMenuItems: experienceItems,
      supportMenuItems,
    }),
    [
      actionItems,
      dividerStyles,
      experienceItems,
      financialMenuItems,
      headerStyles,
      menuStyles,
      supportMenuItems,
    ],
  );

  const onNavigateMenu = React.useCallback(
    (route: AppLeafRouteName) => {
      navigateToAppLeaf(navigation, route);
    },
    [navigation],
  );

  const onProfileShortcut = React.useCallback(
    (route: ProfileShortcutRoute) => {
      navigateToAppLeaf(navigation, route);
    },
    [navigation],
  );

  const onStartVerify = React.useCallback(
    (channel: VerifyChannel) => {
      navigation.dispatch(
        CommonActions.navigate({
          name: 'Verify',
          params: { type: channel },
        }),
      );
    },
    [navigation],
  );

  const onRetry = React.useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <ScrollView
      contentContainerStyle={menuStyles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <ProfileContent
        isPending={isPending}
        isError={isError}
        isFetching={isFetching}
        user={user}
        profileUser={profileUser}
        initials={initials}
        avatarUri={avatarUri}
        shellConfig={shellConfig}
        menuConfig={menuConfig}
        onNavigate={onNavigateMenu}
        onProfileShortcut={onProfileShortcut}
        onStartVerify={onStartVerify}
        onRetry={onRetry}
      />
    </ScrollView>
  );
};

export const ProfileScreen = React.memo(ProfileScreenComponent);
ProfileScreen.displayName = 'ProfileScreen';
