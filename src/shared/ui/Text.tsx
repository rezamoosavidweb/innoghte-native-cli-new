import * as React from 'react';
import {
  StyleSheet,
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';

import { fontWeightHintFromStyle, getFontFamily } from '@/shared/config/fonts';

import { useTypographyLocale } from '@/shared/ui/TypographyContext';

export type TextProps = RNTextProps;

export const Text = React.forwardRef<RNText, TextProps>(
  function Text({ style, ...rest }: TextProps, ref) {
    const { locale } = useTypographyLocale();

    const resolvedStyle = React.useMemo(() => {
      const flat = StyleSheet.flatten(style);
      if (flat?.fontFamily) return style;

      const family = getFontFamily(locale, fontWeightHintFromStyle(flat?.fontWeight));
      const baseFace: TextStyle = { fontFamily: family };
      return flat?.fontWeight != null ? [baseFace, style, { fontWeight: 'normal' }] : [baseFace, style];
    }, [locale, style]);

    return <RNText ref={ref} style={resolvedStyle as RNTextProps['style']} {...rest} />;
  },
);
