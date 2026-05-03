import { Text } from '@/shared/ui/Text';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

import { UserInfoRow } from '@/domains/user/components/UserInfoRow';
import type { ProfileHeaderUser } from '@/domains/user/model/profileHeaderUser';
import { resolveProfileHeaderDisplayName } from '@/domains/user/model/profileHeaderUser';
import type { ProfileHeaderStyleSet } from '@/domains/user/ui/profileScreen.styles';
import HandHear from '@/assets/icons/hand-heart.svg';
import { VerifyChannel } from '@/shared/contracts';

export type ProfileHeaderProps = {
  profileUser: ProfileHeaderUser;
  initials: string;
  avatarUri: string | null;
  styles: ProfileHeaderStyleSet;
  onStartVerify: (channel: VerifyChannel) => void;
};

export const ProfileHeader = React.memo(function ProfileHeader({
  profileUser,
  initials,
  avatarUri,
  styles: s,
  onStartVerify,
}: ProfileHeaderProps) {
  const { t } = useTranslation();
  const displayName = resolveProfileHeaderDisplayName(profileUser);
  const needsVerificationLabel = t('screens.profile.needsVerification');
  const verifiedLabel = t('screens.profile.verifiedLabel');

  return (
    <View style={s.surface}>
      <View style={s.headerRow}>
        {avatarUri ? (
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: avatarUri }}
            style={s.avatarImage}
            resizeMode="cover"
          />
        ) : (
          <View style={s.avatar}>
            <Text style={s.initials} numberOfLines={1}>
              {initials}
            </Text>
          </View>
        )}
        <View style={s.nameColumn}>
          <View style={s.displayNameRow}>
            <Text style={s.fullName} numberOfLines={2}>
              {displayName}
            </Text>
            <HandHear />
          </View>
          <View style={s.infoRows}>
            <UserInfoRow
              value={profileUser.email || '—'}
              verified={profileUser.isEmailVerified}
              verificationKind="email"
              onPressVerify={onStartVerify}
              needsVerificationLabel={needsVerificationLabel}
              verifiedLabel={verifiedLabel}
              styles={s}
            />
            <UserInfoRow
              value={profileUser.phone || '—'}
              verified={profileUser.isPhoneVerified}
              verificationKind="mobile"
              onPressVerify={onStartVerify}
              needsVerificationLabel={needsVerificationLabel}
              verifiedLabel={verifiedLabel}
              styles={s}
            />
          </View>
        </View>
      </View>
    </View>
  );
});
ProfileHeader.displayName = 'ProfileHeader';
