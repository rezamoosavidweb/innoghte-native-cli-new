import { Text } from '@/shared/ui/Text';
import * as React from 'react';
import { View } from 'react-native';

import type { ProfileHeaderStyleSet } from '@/domains/user/ui/profileScreen.styles';
import type { VerifyChannel } from '@/shared/contracts/verification';
import { Tag } from '@/ui/components/tag';

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
          <Tag title={verifiedLabel} color="success" />
        ) : (
          <Tag
            title={needsVerificationLabel}
            onPress={onPressNeedsVerification}
            variant="outlined"
            color="primary"
          />
        )}
      </View>
    </View>
  );
});
UserInfoRow.displayName = 'UserInfoRow';
