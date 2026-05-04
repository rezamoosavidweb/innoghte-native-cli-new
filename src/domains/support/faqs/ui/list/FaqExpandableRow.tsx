import * as React from 'react';
import {LayoutAnimation, View} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from '@/shared/ui/Text';

import { createFaqExpandableRowStyles } from '@/domains/support/faqs/ui';
import { Button } from '@/ui/components/Button';

type Props = {
  question: string;
  answer: string;
};

export const FaqExpandableRow = React.memo(function FaqExpandableRow({
  question,
  answer,
}: Props) {
  const { colors } = useTheme();
  const s = createFaqExpandableRowStyles(colors);
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
      <Button
        layout="auto"
        variant="text"
        title={question}
        accessibilityState={{ expanded }}
        onPress={handlePress}
        style={s.header}
        contentStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Text style={s.q}>{question}</Text>
        <Text style={s.chev}>{expanded ? '▾' : '▸'}</Text>
      </Button>
      {expanded ? <Text style={s.a}>{answer}</Text> : null}
    </View>
  );
});
FaqExpandableRow.displayName = 'FaqExpandableRow';
