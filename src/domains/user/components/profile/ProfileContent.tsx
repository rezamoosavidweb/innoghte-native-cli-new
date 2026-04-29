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

export type ProfileContentProps = {
  isPending: boolean;
  isError: boolean;
  isFetching: boolean;
  user: UserDto | undefined;
  profileUser: ProfileHeaderUser | null;
  initials: string;
  avatarUri: string | null;
  shellStyles: ProfileScreenShellStyleSet;
  headerStyles: ProfileHeaderStyleSet;
  menuStyles: ProfileScreenMenuStyleSet;
  dividerStyles: SectionDividerStyleSet;
  scaffoldSubtitleStyle: TextStyle;
  scaffoldSectionTitleStyle: TextStyle;
  activityColor: string;
  actionMenuItems: readonly ProfileMenuListItem[];
  financialMenuItems: readonly ProfileMenuListItem[];
  experienceMenuItems: readonly ProfileMenuListItem[];
  supportMenuItems: readonly ProfileMenuListItem[];
  loadingMessage: string;
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
  shellStyles,
  headerStyles,
  menuStyles,
  dividerStyles,
  scaffoldSubtitleStyle,
  scaffoldSectionTitleStyle,
  activityColor,
  actionMenuItems,
  financialMenuItems,
  experienceMenuItems,
  supportMenuItems,
  loadingMessage,
  onNavigate,
  onProfileShortcut,
  onStartVerify,
  onRetry,
}: ProfileContentProps) {
  if (isPending && !user) {
    return (
      <ProfileLoadingState
        shellStyles={shellStyles}
        subtitleStyle={scaffoldSubtitleStyle}
        message={loadingMessage}
        activityColor={activityColor}
      />
    );
  }

  if (isError || !user || !profileUser) {
    return (
      <ProfileErrorState
        shellStyles={shellStyles}
        errorTitleStyle={scaffoldSectionTitleStyle}
        retryBaseStyle={scaffoldSubtitleStyle}
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
        headerStyles={headerStyles}
        menuStyles={menuStyles}
        dividerStyles={dividerStyles}
        actionMenuItems={actionMenuItems}
        financialMenuItems={financialMenuItems}
        experienceMenuItems={experienceMenuItems}
        supportMenuItems={supportMenuItems}
        onNavigate={onNavigate}
        onProfileShortcut={onProfileShortcut}
        onStartVerify={onStartVerify}
      />
  );
});
ProfileContent.displayName = 'ProfileContent';
