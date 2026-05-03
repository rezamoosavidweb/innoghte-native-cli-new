import { Text } from '@/shared/ui/Text';
import * as React from 'react';
import { Pressable, View } from 'react-native';

import type { ProfileHeaderStyleSet } from '@/domains/user/ui/profileScreen.styles';
import type { VerifyChannel } from '@/shared/contracts/verification';

export type UserInfoRowProps = {
  value: string;
  verified: boolean;
  verificationKind: VerifyChannel;
  onPressVerify: (channel: VerifyChannel) => void;
  needsVerificationLabel: string;
  verifiedLabel: string;
  styles: ProfileHeaderStyleSet;
};

/**
 * Contact row: label + value; verified SVG badge or “needs verification” action.
 */
export const UserInfoRow = React.memo(function UserInfoRow({
  value,
  verified,
  verificationKind,
  onPressVerify,
  needsVerificationLabel,
  verifiedLabel,
  styles: s,
}: UserInfoRowProps) {
  const onPressNeedsVerification = React.useCallback(() => {
    onPressVerify(verificationKind);
  }, [onPressVerify, verificationKind]);

  return (
    <View style={s.userInfoRow}>
      <View style={s.userInfoTextBlock}>
        <Text style={s.userInfoValue} selectable>
          {value}
        </Text>
      </View>
      <View style={s.userInfoTrailing}>
        {verified ? (
          <Text style={s.verifiedLabel} numberOfLines={2}>
            {verifiedLabel}
          </Text>
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
