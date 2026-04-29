import * as React from 'react';
import { View } from 'react-native';

import { ProfileActionButton } from '@/domains/user/components/ActionButton';
import type { ProfileHeaderStyleSet } from '@/domains/user/ui/profileScreen.styles';

export type ProfileShortcutRoute = 'Account' | 'Security' | 'EditProfile';

export type ProfileShortcutButtonsProps = {
  accountLabel: string;
  securityLabel: string;
  editProfileLabel: string;
  headerStyles: ProfileHeaderStyleSet;
  onShortcut: (route: ProfileShortcutRoute) => void;
};

export const ProfileShortcutButtons = React.memo(function ProfileShortcutButtons({
  accountLabel,
  securityLabel,
  editProfileLabel,
  headerStyles: hs,
  onShortcut,
}: ProfileShortcutButtonsProps) {
  const actionStyles = React.useMemo(
    () => ({
      button: hs.actionButton,
      buttonPressed: hs.actionButtonPressed,
      label: hs.actionButtonLabel,
    }),
    [hs.actionButton, hs.actionButtonLabel, hs.actionButtonPressed],
  );

  const onAccount = React.useCallback(() => {
    onShortcut('Account');
  }, [onShortcut]);

  const onSecurity = React.useCallback(() => {
    onShortcut('Security');
  }, [onShortcut]);

  const onEditProfile = React.useCallback(() => {
    onShortcut('EditProfile');
  }, [onShortcut]);

  return (
    <View style={hs.actionRow}>
      <ProfileActionButton
        label={accountLabel}
        onPress={onAccount}
        styles={actionStyles}
      />
      <ProfileActionButton
        label={securityLabel}
        onPress={onSecurity}
        styles={actionStyles}
      />
      <ProfileActionButton
        label={editProfileLabel}
        onPress={onEditProfile}
        styles={actionStyles}
      />
    </View>
  );
});
ProfileShortcutButtons.displayName = 'ProfileShortcutButtons';
