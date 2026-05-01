import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {Image, View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { UserInfoRow } from '@/domains/user/components/UserInfoRow';
import type { ProfileHeaderUser } from '@/domains/user/model/profileHeaderUser';
import { resolveProfileHeaderDisplayName } from '@/domains/user/model/profileHeaderUser';
import type { ProfileHeaderStyleSet } from '@/domains/user/ui/profileScreen.styles';
import type { VerifyChannel } from '@/shared/contracts/verification';
import { useThemeColors } from '@/ui/theme';

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
  const themeColors = useThemeColors();
  const displayName = resolveProfileHeaderDisplayName(profileUser);
  const needsVerificationLabel = t('screens.profile.needsVerification');

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
          <Text style={s.fullName} numberOfLines={2}>
            {displayName}
          </Text>
          <View style={s.infoRows}>
            <UserInfoRow
              label={t('screens.profile.email')}
              value={profileUser.email || '—'}
              verified={profileUser.isEmailVerified}
              verificationKind="email"
              onPressVerify={onStartVerify}
              verifiedIconColor={themeColors.successText}
              needsVerificationLabel={needsVerificationLabel}
              styles={s}
            />
            <UserInfoRow
              label={t('screens.profile.mobile')}
              value={profileUser.phone || '—'}
              verified={profileUser.isPhoneVerified}
              verificationKind="mobile"
              onPressVerify={onStartVerify}
              verifiedIconColor={themeColors.successText}
              needsVerificationLabel={needsVerificationLabel}
              styles={s}
            />
          </View>
        </View>
      </View>
    </View>
  );
});
ProfileHeader.displayName = 'ProfileHeader';
