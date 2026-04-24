import * as React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { useScreenScaffoldStyles } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export const ScreenScaffold = React.memo(function ScreenScaffold({
  title,
  subtitle,
  children,
}: Props) {
  const { colors } = useTheme();
  const s = useScreenScaffoldStyles(colors);

  return (
    <View style={s.root}>
      <Text style={s.title}>{title}</Text>
      {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
});
