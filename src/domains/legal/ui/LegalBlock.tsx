import * as React from 'react';
import { View, type TextStyle } from 'react-native';
import { Text } from '@/shared/ui/Text';

export const LegalBlock = React.memo(function LegalBlock({
  title,
  body,
  sectionTitleStyle,
  pStyle,
}: {
  title: string;
  body: string;
  sectionTitleStyle: TextStyle;
  pStyle: TextStyle;
}) {
  return (
    <View>
      <Text style={sectionTitleStyle}>{title}</Text>
      <Text style={pStyle}>{body}</Text>
    </View>
  );
});
