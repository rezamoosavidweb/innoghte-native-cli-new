import * as React from 'react';
import {Pressable, View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { VerifyChannel } from '@/shared/contracts/verification';
import { VerifiedIcon } from '@/domains/user/components/VerifiedIcon';
import type { ProfileHeaderStyleSet } from '@/domains/user/ui/profileScreen.styles';

export type UserInfoRowProps = {
  label: string;
  value: string;
  verified: boolean;
  verificationKind: VerifyChannel;
  onPressVerify: (channel: VerifyChannel) => void;
  verifiedIconColor: string;
  needsVerificationLabel: string;
  styles: ProfileHeaderStyleSet;
};

/**
 * Contact row: label + value; verified SVG badge or “needs verification” action.
 */
export const UserInfoRow = React.memo(function UserInfoRow({
  label,
  value,
  verified,
  verificationKind,
  onPressVerify,
  verifiedIconColor,
  needsVerificationLabel,
  styles: s,
}: UserInfoRowProps) {
  const onPressNeedsVerification = React.useCallback(() => {
    onPressVerify(verificationKind);
  }, [onPressVerify, verificationKind]);

  return (
    <View style={s.userInfoRow}>
      <View style={s.userInfoTextBlock}>
        <Text style={s.userInfoLabel}>{label}</Text>
        <Text style={s.userInfoValue} selectable>
          {value}
        </Text>
      </View>
      <View style={s.userInfoTrailing}>
        {verified ? (
          <VerifiedIcon
            color={verifiedIconColor}
            size={20}
            accessibilityLabel={`${label} verified`}
          />
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={needsVerificationLabel}
            onPress={onPressNeedsVerification}
            style={({ pressed }) =>
              pressed
                ? [s.needsVerificationButton, s.needsVerificationButtonPressed]
                : s.needsVerificationButton
            }
          >
            <Text style={s.needsVerificationLabel} numberOfLines={2}>
              {needsVerificationLabel}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
});
UserInfoRow.displayName = 'UserInfoRow';
