import * as React from 'react';
import { Text, View, type TextStyle } from 'react-native';

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
