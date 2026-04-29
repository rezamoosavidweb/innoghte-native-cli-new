import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Text, View } from 'react-native';

import { useNavScreenShellStyles } from '@/ui/theme';

export type EmptyStateProps = {
  title: string;
  subtitle?: string;
};

const EmptyStateComponent = ({ title, subtitle }: EmptyStateProps) => {
  const { colors } = useTheme();
  const shell = useNavScreenShellStyles(colors);

  return (
    <View style={shell.centered}>
      <Text style={shell.errorText}>{title}</Text>
      {subtitle ? <Text style={shell.errorDetail}>{subtitle}</Text> : null}
    </View>
  );
};

export const EmptyState = React.memo(EmptyStateComponent);
EmptyState.displayName = 'EmptyState';
