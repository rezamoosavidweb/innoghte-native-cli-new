import * as React from 'react';
import { View } from 'react-native';

import { ProfileHeader } from '@/domains/user/components/ProfileHeader';
import type { ProfileHeaderUser } from '@/domains/user/model/profileHeaderUser';
import type { ProfileScreenSection } from '@/domains/user/model/profileMenu.types';
import type {
  ProfileHeaderStyleSet,
  ProfileScreenMenuStyleSet,
} from '@/domains/user/ui/profileScreen.styles';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';
import type { VerifyChannel } from '@/shared/contracts/verification';
import type { SectionDividerStyleSet } from '@/ui/theme';

import { DarkModeToggleRow } from './DarkModeToggleRow';
import { ProfileMenuBlock } from './ProfileMenuBlock';
import { type ProfileShortcutRoute } from './ProfileShortcutButtons';

export type ProfileViewProps = Readonly<{
  profileUser: ProfileHeaderUser;
  initials: string;
  avatarUri: string | null;
  sections: readonly ProfileScreenSection[];
  styles: Readonly<{
    header: ProfileHeaderStyleSet;
    menu: ProfileScreenMenuStyleSet;
    divider: SectionDividerStyleSet;
  }>;
  actions: Readonly<{
    onNavigate: (route: AppLeafRouteName) => void;
    onProfileShortcut: (route: ProfileShortcutRoute) => void;
    onStartVerify: (channel: VerifyChannel) => void;
  }>;
}>;

export const ProfileView = React.memo(function ProfileView({
  profileUser,
  initials,
  avatarUri,
  sections,
  styles,
  actions,
}: ProfileViewProps) {
  const blockStyles = { menu: styles.menu, divider: styles.divider };

  return (
    <View style={styles.menu.loadedStack}>
      <ProfileHeader
        profileUser={profileUser}
        initials={initials}
        avatarUri={avatarUri}
        styles={styles.header}
        onStartVerify={actions.onStartVerify}
      />
      {sections.map(section => (
        <ProfileMenuBlock
          key={section.key}
          title={section.title}
          items={section.items}
          onNavigate={actions.onNavigate}
          styles={blockStyles}
          extraContent={
            section.key === 'general'
              ? <DarkModeToggleRow menuStyles={styles.menu} />
              : undefined
          }
        />
      ))}
    </View>
  );
});
ProfileView.displayName = 'ProfileView';
