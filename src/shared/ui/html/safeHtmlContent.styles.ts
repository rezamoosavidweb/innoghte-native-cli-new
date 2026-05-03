import type { StyleProp, TextStyle } from 'react-native';

import { fontSize, lineHeight } from '@/ui/theme/core/typography';

export function createSafeHtmlTextStyles(
  color: string,
  baseSize: number = fontSize.base,
): StyleProp<TextStyle> {
  return {
    color,
    fontSize: baseSize,
    lineHeight: lineHeight.relaxed,
    textAlign: 'right',
    writingDirection: 'rtl',
  };
}
