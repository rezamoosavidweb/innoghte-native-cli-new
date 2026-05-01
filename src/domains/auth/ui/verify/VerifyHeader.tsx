import * as React from 'react';
import {View, type TextStyle} from 'react-native';
import { Text } from '@/shared/ui/Text';

export type VerifyHeaderProps = {
  title: string;
  subtitle: string;
  titleStyle: TextStyle;
  subtitleStyle: TextStyle;
};

export const VerifyHeader = React.memo(function VerifyHeader({
  title,
  subtitle,
  titleStyle,
  subtitleStyle,
}: VerifyHeaderProps) {
  return (
    <View accessibilityRole="header">
      <Text style={titleStyle}>{title}</Text>
      <Text style={subtitleStyle}>{subtitle}</Text>
    </View>
  );
});
VerifyHeader.displayName = 'VerifyHeader';
