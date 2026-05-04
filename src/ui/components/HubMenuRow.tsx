import * as React from 'react';
import {View, type ViewStyle, type TextStyle} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { Button } from '@/ui/components/Button';

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
    <Button
      layout="auto"
      variant="text"
      title={title}
      onPress={onPress}
      style={s.menuRow}
      contentStyle={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <View style={s.menuRowLeft}>
        <Text style={s.menuIcon}>{icon}</Text>
        <Text style={s.menuTitle}>{title}</Text>
      </View>
      <Text style={s.chevron}>›</Text>
    </Button>
  );
});
HubMenuRow.displayName = 'HubMenuRow';
