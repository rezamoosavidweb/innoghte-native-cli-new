import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

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

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.text }]}>
          {subtitle}
        </Text>
      ) : null}
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.72,
  },
});
