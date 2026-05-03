import * as React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

import { sanitizeHtmlToPlainText } from '@/shared/ui/html/sanitizeHtml';

export type SafeHtmlContentProps = {
  html: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  selectable?: boolean;
  testID?: string;
};

export const SafeHtmlContent = React.memo(function SafeHtmlContent({
  html,
  style,
  numberOfLines,
  selectable,
  testID,
}: SafeHtmlContentProps) {
  const plain = React.useMemo(() => sanitizeHtmlToPlainText(html), [html]);
  return (
    <Text
      testID={testID}
      style={style}
      numberOfLines={numberOfLines}
      selectable={selectable}
    >
      {plain}
    </Text>
  );
});

SafeHtmlContent.displayName = 'SafeHtmlContent';
