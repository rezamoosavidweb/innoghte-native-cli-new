import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import {
  createNavScreenShellStyles,
  useThemeColors,
} from '@/ui/theme';

import { useErrorStateButtonStyles } from '@/shared/ui/list-states/errorState.styles';

export type ErrorStateProps = {
  title: string;
  detail?: string;
  onRetry: () => void;
  retryLabel: string;
};

const ErrorStateComponent = ({
  title,
  detail,
  onRetry,
  retryLabel,
}: ErrorStateProps) => {
  const { colors } = useTheme();
  const themeColors = useThemeColors();
  const shell = createNavScreenShellStyles(colors);

  const btnStyles = useErrorStateButtonStyles(colors, themeColors);

  return (
    <View style={shell.centered} accessibilityRole="alert">
      <Text style={shell.errorText}>{title}</Text>
      {detail ? <Text style={shell.errorDetail}>{detail}</Text> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={retryLabel}
        onPress={onRetry}
        style={({ pressed }) => [
          btnStyles.retryPressable,
          pressed && { opacity: 0.85 },
        ]}
      >
        <Text style={btnStyles.retryLabel}>{retryLabel}</Text>
      </Pressable>
    </View>
  );
};

export const ErrorState = React.memo(ErrorStateComponent);
ErrorState.displayName = 'ErrorState';
