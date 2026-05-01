import * as React from 'react';
import {LayoutAnimation, Pressable, View} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from '@/shared/ui/Text';

import { useFaqExpandableRowStyles } from '@/domains/support/faqs/ui';

type Props = {
  question: string;
  answer: string;
};

export const FaqExpandableRow = React.memo(function FaqExpandableRow({
  question,
  answer,
}: Props) {
  const { colors } = useTheme();
  const s = useFaqExpandableRowStyles(colors);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    setExpanded(false);
  }, [question, answer]);

  const handlePress = React.useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(v => !v);
  }, []);

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
FaqExpandableRow.displayName = 'FaqExpandableRow';
