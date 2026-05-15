import * as React from 'react';
import { View, type ViewStyle, type TextStyle } from 'react-native';
import { Text } from '@/shared/ui/Text';
import IconLeftIcon from '@/assets/icons/arrow-left.svg';

import { Button } from '@/ui/components/Button';
import { SvgProps } from 'react-native-svg';

export type HubMenuRowStyleSet = {
  menuRow: ViewStyle;
  menuRowContent: ViewStyle;
  menuRowPressed: ViewStyle;
  menuRowLeft: ViewStyle;
  menuIcon: TextStyle;
  menuTitle: TextStyle;
  chevron: TextStyle;
};

type Props = {
  icon: React.FC<SvgProps>;
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
  const Icon = icon;
  return (
    <Button
      layout="auto"
      variant="text"
      title={title}
      onPress={onPress}
      style={s.menuRow}
      contentStyle={s.menuRowContent}
    >
      <View style={s.menuRowLeft}>
        <Icon width={24} height={24} style={s.menuIcon} />
        <Text style={s.menuTitle}>{title}</Text>
      </View>
      <IconLeftIcon width={24} height={24} style={s.chevron} />
    </Button>
  );
});
HubMenuRow.displayName = 'HubMenuRow';
