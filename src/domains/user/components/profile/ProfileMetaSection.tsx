import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { UserDto } from '@/domains/auth/model/apiTypes';
import { getAccountStatusMessageKey } from '@/domains/user/model/profileScreenLabels';
import type { ProfileScreenShellStyleSet } from '@/domains/user/ui/profileScreen.styles';

export type ProfileMetaSectionProps = {
  user: UserDto;
  shellStyles: ProfileScreenShellStyleSet;
};

export const ProfileMetaSection = React.memo(function ProfileMetaSection({
  user,
  shellStyles,
}: ProfileMetaSectionProps) {
  const { t } = useTranslation();
  const accountStatusKey = getAccountStatusMessageKey(user.is_active);

  return (
    <View style={shellStyles.accountMeta}>
      <Text style={shellStyles.accountMetaLabel}>
        {t('screens.profile.lastLogin')}
      </Text>
      <Text style={shellStyles.accountMetaValue} selectable>
        {user.last_login}
      </Text>
      <Text style={shellStyles.accountMetaFooter}>{t(accountStatusKey)}</Text>
    </View>
  );
});
ProfileMetaSection.displayName = 'ProfileMetaSection';
