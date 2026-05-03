import { CommonActions, useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import type { TextStyle } from 'react-native';

import { navigateToAppLeaf } from '@/app/bridge/auth';
import { useCurrentUser } from '@/domains/auth/hooks/useCurrentUser';
import type { UserDto } from '@/domains/auth/model/apiTypes';
import type { ProfileShortcutRoute } from '@/domains/user/components/profile/ProfileShortcutButtons';
import { useProfileDerivedState } from '@/domains/user/hooks/useProfileDerivedState';
import { useProfileFinancialMenus } from '@/domains/user/hooks/useProfileFinancialMenus';
import { useProfileMenus } from '@/domains/user/hooks/useProfileMenus';
import { useProfileSupportMenus } from '@/domains/user/hooks/useProfileSupportMenus';
import type { ProfileScreenSection } from '@/domains/user/model/profileMenu.types';
import {
  createProfileHeaderStyles,
  createProfileMenuStyles,
  createProfileShellStyles,
  type ProfileHeaderStyleSet,
  type ProfileScreenMenuStyleSet,
  type ProfileScreenShellStyleSet,
} from '@/domains/user/ui/profileScreen.styles';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';
import type { VerifyChannel } from '@/shared/contracts/verification';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import {
  createScreenScaffoldStyles,
  createSectionDividerStyles,
  type SectionDividerStyleSet,
} from '@/ui/theme';
import { useProfileGeneralMenus } from './useProfileGeneralMenus';

export type ProfileScreenModelStyles = Readonly<{
  shell: ProfileScreenShellStyleSet;
  scaffoldSubtitle: TextStyle;
  scaffoldSectionTitle: TextStyle;
  header: ProfileHeaderStyleSet;
  menu: ProfileScreenMenuStyleSet;
  divider: SectionDividerStyleSet;
  activityColor: string;
}>;

export type ProfileScreenModel = Readonly<{
  isPending: boolean;
  isError: boolean;
  isFetching: boolean;
  user: UserDto | undefined;
  profileUser: ReturnType<typeof useProfileDerivedState>['profileUser'];
  initials: string;
  avatarUri: string | null;
  sections: readonly ProfileScreenSection[];
  loadingMessage: string;
  styles: ProfileScreenModelStyles;
  actions: Readonly<{
    onNavigate: (route: AppLeafRouteName) => void;
    onProfileShortcut: (route: ProfileShortcutRoute) => void;
    onStartVerify: (channel: VerifyChannel) => void;
    onRetry: () => void;
  }>;
}>;

export function useProfileScreenModel(): ProfileScreenModel {
  const theme = useTheme();
  const { colors } = theme;
  const { t } = useTranslation();
  const navigation = useAppNavigation();

  const scaffoldStyles = createScreenScaffoldStyles(colors);
  const shellStyles = createProfileShellStyles(colors, theme);
  const headerStyles = createProfileHeaderStyles(colors, theme);
  const menuStyles = createProfileMenuStyles(colors);
  const dividerStyles = createSectionDividerStyles(colors, theme);

  const generalMenuItems = useProfileGeneralMenus(t);
  // const { actionItems, experienceItems } = useProfileMenus(t);
  const { experienceItems } = useProfileMenus(t);
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

  const sections = React.useMemo(
    (): ProfileScreenSection[] => [
      {
        key: 'general',
        title: t('tabs.general'),
        items: generalMenuItems,
      },
      {
        key: 'financial',
        title: t('screens.profile.sectionFinancial'),
        items: financialMenuItems,
      },
      {
        key: 'experiences',
        title: t('screens.profile.sectionExperiences'),
        items: experienceItems,
      },
      {
        key: 'support',
        title: t('screens.profile.sectionSupportLegal'),
        items: supportMenuItems,
      },
    ],
    [
      t,
      generalMenuItems,
      financialMenuItems,
      experienceItems,
      supportMenuItems,
    ],
  );

  const onNavigate = React.useCallback(
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

  const styles: ProfileScreenModelStyles = {
    shell: shellStyles,
    scaffoldSubtitle: scaffoldStyles.subtitle,
    scaffoldSectionTitle: scaffoldStyles.sectionTitle,
    header: headerStyles,
    menu: menuStyles,
    divider: dividerStyles,
    activityColor: colors.text,
  };

  return {
    isPending,
    isError,
    isFetching,
    user,
    profileUser,
    initials,
    avatarUri,
    sections,
    loadingMessage: t('screens.profile.loading'),
    styles,
    actions: {
      onNavigate,
      onProfileShortcut,
      onStartVerify,
      onRetry,
    },
  };
}
