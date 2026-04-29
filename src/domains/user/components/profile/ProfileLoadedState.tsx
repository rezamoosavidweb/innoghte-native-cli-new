import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ProfileHeader } from '@/domains/user/components/ProfileHeader';
import type { ProfileMenuListItem } from '@/domains/user/model/profileMenu.types';
import type { ProfileHeaderUser } from '@/domains/user/model/profileHeaderUser';
import type {
  ProfileHeaderStyleSet,
  ProfileScreenMenuStyleSet,
} from '@/domains/user/ui/profileScreen.styles';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';
import type { VerifyChannel } from '@/shared/contracts/verification';
import type { SectionDividerStyleSet } from '@/ui/theme';

import { ProfileExperiencesSection } from './ProfileExperiencesSection';
import { ProfileFinancialSection } from './ProfileFinancialSection';
import { ProfileServicesSection } from './ProfileServicesSection';
import { ProfileSupportSection } from './ProfileSupportSection';
import {
  ProfileShortcutButtons,
  type ProfileShortcutRoute,
} from './ProfileShortcutButtons';

export type ProfileLoadedStateProps = {
  profileUser: ProfileHeaderUser;
  initials: string;
  avatarUri: string | null;
  headerStyles: ProfileHeaderStyleSet;
  menuStyles: ProfileScreenMenuStyleSet;
  dividerStyles: SectionDividerStyleSet;
  actionMenuItems: readonly ProfileMenuListItem[];
  financialMenuItems: readonly ProfileMenuListItem[];
  experienceMenuItems: readonly ProfileMenuListItem[];
  supportMenuItems: readonly ProfileMenuListItem[];
  onNavigate: (route: AppLeafRouteName) => void;
  onProfileShortcut: (route: ProfileShortcutRoute) => void;
  onStartVerify: (channel: VerifyChannel) => void;
};

export const ProfileLoadedState = React.memo(function ProfileLoadedState({
  profileUser,
  initials,
  avatarUri,
  headerStyles,
  menuStyles,
  dividerStyles,
  actionMenuItems,
  financialMenuItems,
  experienceMenuItems,
  supportMenuItems,
  onNavigate,
  onProfileShortcut,
  onStartVerify,
}: ProfileLoadedStateProps) {
  const { t } = useTranslation();

  const accountLabel = t('screens.profile.actions.account');
  const securityLabel = t('screens.profile.actions.security');
  const editProfileLabel = t('screens.profile.actions.editProfile');

  return (
    <View style={menuStyles.loadedStack}>
      <ProfileHeader
        profileUser={profileUser}
        initials={initials}
        avatarUri={avatarUri}
        styles={headerStyles}
        onStartVerify={onStartVerify}
      />
      <ProfileShortcutButtons
        accountLabel={accountLabel}
        securityLabel={securityLabel}
        editProfileLabel={editProfileLabel}
        headerStyles={headerStyles}
        onShortcut={onProfileShortcut}
      />
      <ProfileServicesSection
        items={actionMenuItems}
        menuStyles={menuStyles}
        dividerStyles={dividerStyles}
        onNavigate={onNavigate}
      />
      <ProfileFinancialSection
        items={financialMenuItems}
        menuStyles={menuStyles}
        dividerStyles={dividerStyles}
        onNavigate={onNavigate}
      />
      <ProfileExperiencesSection
        items={experienceMenuItems}
        menuStyles={menuStyles}
        dividerStyles={dividerStyles}
        onNavigate={onNavigate}
      />
      <ProfileSupportSection
        items={supportMenuItems}
        menuStyles={menuStyles}
        dividerStyles={dividerStyles}
        onNavigate={onNavigate}
      />
    </View>
  );
});
ProfileLoadedState.displayName = 'ProfileLoadedState';
