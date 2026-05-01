import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {ActivityIndicator, View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { createNavScreenShellStyles } from '@/ui/theme';

export type LoadingStateProps = {
  /** Shown below the spinner */
  message: string;
};

const LoadingStateComponent = ({ message }: LoadingStateProps) => {
  const { colors } = useTheme();
  const shell = createNavScreenShellStyles(colors);

  return (
    <View style={shell.centered}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={shell.loadingText}>{message}</Text>
    </View>
  );
};

export const LoadingState = React.memo(LoadingStateComponent);
LoadingState.displayName = 'LoadingState';
