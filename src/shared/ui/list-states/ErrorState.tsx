import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import {
  createNavScreenShellStyles,
  useThemeColors,
} from '@/ui/theme';

import { useErrorStateButtonStyles } from '@/shared/ui/list-states/errorState.styles';
import { Button } from '@/ui/components/Button';

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
      <Button
        layout="auto"
        variant="text"
        title={retryLabel}
        onPress={onRetry}
        style={btnStyles.retryPressable}
        contentStyle={{ width: '100%' }}
      >
        <Text style={btnStyles.retryLabel}>{retryLabel}</Text>
      </Button>
    </View>
  );
};

export const ErrorState = React.memo(ErrorStateComponent);
ErrorState.displayName = 'ErrorState';
