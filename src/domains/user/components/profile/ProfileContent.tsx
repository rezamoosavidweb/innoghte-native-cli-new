import * as React from 'react';
import type { TextStyle } from 'react-native';

import type { UserDto } from '@/domains/auth/model/apiTypes';
import type { ProfileMenuListItem } from '@/domains/user/model/profileMenu.types';
import type { ProfileHeaderUser } from '@/domains/user/model/profileHeaderUser';
import type {
  ProfileHeaderStyleSet,
  ProfileScreenMenuStyleSet,
  ProfileScreenShellStyleSet,
} from '@/domains/user/ui/profileScreen.styles';
import type { SectionDividerStyleSet } from '@/ui/theme';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';
import type { VerifyChannel } from '@/shared/contracts/verification';

import { ProfileErrorState } from './ProfileErrorState';
import { ProfileLoadedState } from './ProfileLoadedState';
import { ProfileLoadingState } from './ProfileLoadingState';
import type { ProfileShortcutRoute } from './ProfileShortcutButtons';

export type ProfileContentShellConfig = Readonly<{
  shellStyles: ProfileScreenShellStyleSet;
  scaffoldSubtitleStyle: TextStyle;
  scaffoldSectionTitleStyle: TextStyle;
  activityColor: string;
  loadingMessage: string;
}>;

export type ProfileContentMenuConfig = Readonly<{
  headerStyles: ProfileHeaderStyleSet;
  menuStyles: ProfileScreenMenuStyleSet;
  dividerStyles: SectionDividerStyleSet;
  actionMenuItems: readonly ProfileMenuListItem[];
  financialMenuItems: readonly ProfileMenuListItem[];
  experienceMenuItems: readonly ProfileMenuListItem[];
  supportMenuItems: readonly ProfileMenuListItem[];
}>;

export type ProfileContentProps = {
  isPending: boolean;
  isError: boolean;
  isFetching: boolean;
  user: UserDto | undefined;
  profileUser: ProfileHeaderUser | null;
  initials: string;
  avatarUri: string | null;
  shellConfig: ProfileContentShellConfig;
  menuConfig: ProfileContentMenuConfig;
  onNavigate: (route: AppLeafRouteName) => void;
  onProfileShortcut: (route: ProfileShortcutRoute) => void;
  onStartVerify: (channel: VerifyChannel) => void;
  onRetry: () => void;
};

export const ProfileContent = React.memo(function ProfileContent({
  isPending,
  isError,
  isFetching,
  user,
  profileUser,
  initials,
  avatarUri,
  shellConfig,
  menuConfig,
  onNavigate,
  onProfileShortcut,
  onStartVerify,
  onRetry,
}: ProfileContentProps) {
  if (isPending && !user) {
    return (
      <ProfileLoadingState
        shellStyles={shellConfig.shellStyles}
        subtitleStyle={shellConfig.scaffoldSubtitleStyle}
        message={shellConfig.loadingMessage}
        activityColor={shellConfig.activityColor}
      />
    );
  }

  if (isError || !user || !profileUser) {
    return (
      <ProfileErrorState
        shellStyles={shellConfig.shellStyles}
        errorTitleStyle={shellConfig.scaffoldSectionTitleStyle}
        retryBaseStyle={shellConfig.scaffoldSubtitleStyle}
        onRetry={onRetry}
        isFetching={isFetching}
      />
    );
  }

  return (
    <ProfileLoadedState
      profileUser={profileUser}
      initials={initials}
      avatarUri={avatarUri}
      headerStyles={menuConfig.headerStyles}
      menuStyles={menuConfig.menuStyles}
      dividerStyles={menuConfig.dividerStyles}
      actionMenuItems={menuConfig.actionMenuItems}
      financialMenuItems={menuConfig.financialMenuItems}
      experienceMenuItems={menuConfig.experienceMenuItems}
      supportMenuItems={menuConfig.supportMenuItems}
      onNavigate={onNavigate}
      onProfileShortcut={onProfileShortcut}
      onStartVerify={onStartVerify}
    />
  );
});
ProfileContent.displayName = 'ProfileContent';
