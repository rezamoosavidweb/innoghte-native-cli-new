import * as React from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  Text,
  UIManager,
  View,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import { useFaqExpandableRowStyles } from '@/components/themed/FaqExpandableRow.styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  question: string;
  answer: string;
  expanded: boolean;
  onToggle: () => void;
};

export const FaqExpandableRow = React.memo(function FaqExpandableRow({
  question,
  answer,
  expanded,
  onToggle,
}: Props) {
  const { colors } = useTheme();
  const s = useFaqExpandableRowStyles(colors);

  const handlePress = React.useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  }, [onToggle]);

  return (
    <View style={s.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={handlePress}
        style={s.header}
      >
        <Text style={s.q}>{question}</Text>
        <Text style={s.chev}>{expanded ? '▾' : '▸'}</Text>
      </Pressable>
      {expanded ? <Text style={s.a}>{answer}</Text> : null}
    </View>
  );
});
