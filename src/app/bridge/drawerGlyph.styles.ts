import * as React from 'react';
import { StyleSheet } from 'react-native';

import { fontWeight } from '@/ui/theme';

export function useDrawerGlyphStyles(color: string, size: number) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        glyph: {
          fontWeight: fontWeight.semibold,
          color,
          fontSize: size - 2,
        },
      }),
    [color, size],
  );
}
