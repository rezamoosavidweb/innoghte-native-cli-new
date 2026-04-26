import * as React from 'react';
import { Pressable, Text, View, type ViewStyle, type TextStyle } from 'react-native';

export type HubMenuRowStyleSet = {
  menuRow: ViewStyle;
  menuRowPressed: ViewStyle;
  menuRowLeft: ViewStyle;
  menuIcon: TextStyle;
  menuTitle: TextStyle;
  chevron: TextStyle;
};

type Props = {
  icon: string;
  title: string;
  onPress: () => void;
  s: HubMenuRowStyleSet;
};

export const HubMenuRow = React.memo(function HubMenuRow({
  icon,
  title,
  onPress,
  s,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => (pressed ? [s.menuRow, s.menuRowPressed] : s.menuRow)}
    >
      <View style={s.menuRowLeft}>
        <Text style={s.menuIcon}>{icon}</Text>
        <Text style={s.menuTitle}>{title}</Text>
      </View>
      <Text style={s.chevron}>›</Text>
    </Pressable>
  );
});
HubMenuRow.displayName = 'HubMenuRow';
