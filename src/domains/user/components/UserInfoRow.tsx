import { Text } from '@/shared/ui/Text';
import * as React from 'react';
import { View } from 'react-native';

import type { ProfileHeaderStyleSet } from '@/domains/user/ui/profileScreen.styles';
import { Button } from '@/ui/components/Button';
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
          <Button
            layout="auto"
            variant="text"
            title={needsVerificationLabel}
            accessibilityLabel={needsVerificationLabel}
            onPress={onPressNeedsVerification}
            style={s.needsVerificationButton}
            contentStyle={{ width: '100%' }}
          >
            <Text style={s.needsVerificationLabel} numberOfLines={2}>
              {needsVerificationLabel}
            </Text>
          </Button>
        )}
      </View>
    </View>
  );
});
UserInfoRow.displayName = 'UserInfoRow';
