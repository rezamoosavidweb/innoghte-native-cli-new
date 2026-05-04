import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {View, type TextStyle} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { getRetryLabelKey } from '@/domains/user/model/profileScreenLabels';
import type { ProfileScreenShellStyleSet } from '@/domains/user/ui/profileScreen.styles';
import { Button } from '@/ui/components/Button';

export type ProfileErrorStateProps = {
  shellStyles: ProfileScreenShellStyleSet;
  errorTitleStyle: TextStyle;
  retryBaseStyle: TextStyle;
  onRetry: () => void;
  isFetching: boolean;
};

export const ProfileErrorState = React.memo(function ProfileErrorState({
  shellStyles,
  errorTitleStyle,
  retryBaseStyle,
  onRetry,
  isFetching,
}: ProfileErrorStateProps) {
  const { t } = useTranslation();
  const retryLabelKey = getRetryLabelKey(isFetching);

  const retryTextStyle = React.useMemo<TextStyle | TextStyle[]>(
    () =>
      isFetching
        ? [retryBaseStyle, shellStyles.errorRetryDisabled]
        : retryBaseStyle,
    [isFetching, retryBaseStyle, shellStyles.errorRetryDisabled],
  );

  return (
    <View style={shellStyles.centered}>
      <Text style={[errorTitleStyle, shellStyles.errorTitleAlign]}>
        {t('screens.profile.error')}
      </Text>
      <Button
        layout="auto"
        variant="text"
        title={t(retryLabelKey)}
        onPress={onRetry}
        disabled={isFetching}
        contentStyle={{ width: '100%' }}
      >
        <Text style={retryTextStyle}>{t(retryLabelKey)}</Text>
      </Button>
    </View>
  );
});
ProfileErrorState.displayName = 'ProfileErrorState';
