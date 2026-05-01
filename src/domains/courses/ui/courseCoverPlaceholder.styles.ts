import { StyleSheet } from 'react-native';

import { hexAlpha } from '@/ui/theme/utils/colorUtils';

export function createCoverFallbackBgStyles(borderColor: string) {
  return StyleSheet.create({
    bg: { backgroundColor: hexAlpha(borderColor, 0.27) },
  });
}

export function createCoverPlaceholderGlyphStyles(textColor: string) {
  return StyleSheet.create({
    glyph: { color: textColor, opacity: 0.5 },
  });
}
