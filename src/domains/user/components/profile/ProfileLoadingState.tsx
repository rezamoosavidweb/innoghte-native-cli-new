import * as React from 'react';
import {ActivityIndicator, View, type TextStyle} from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { ProfileScreenShellStyleSet } from '@/domains/user/ui/profileScreen.styles';

export type ProfileLoadingStateProps = {
  shellStyles: ProfileScreenShellStyleSet;
  subtitleStyle: TextStyle;
  message: string;
  activityColor: string;
};

export const ProfileLoadingState = React.memo(function ProfileLoadingState({
  shellStyles,
  subtitleStyle,
  message,
  activityColor,
}: ProfileLoadingStateProps) {
  return (
    <View style={shellStyles.centered} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={activityColor} />
      <Text style={subtitleStyle}>{message}</Text>
    </View>
  );
});
ProfileLoadingState.displayName = 'ProfileLoadingState';
