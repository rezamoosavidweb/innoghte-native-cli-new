import * as React from 'react';
import {
  I18nManager,
  StyleSheet,
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';

import { fontWeightHintFromStyle, getFontFamily, normalizeAppLanguage } from '@/shared/config/fonts';

import { useTypographyLocale } from '@/shared/ui/TypographyContext';

export type TextProps = RNTextProps;

export const Text = React.forwardRef<RNText, TextProps>(
  function Text({ style, ...rest }: TextProps, ref) {
    const { locale } = useTypographyLocale();

    const resolvedStyle = React.useMemo(() => {
      const flat = StyleSheet.flatten(style);
      const isFa = normalizeAppLanguage(locale) === 'fa';
      // With forceRTL, `textAlign: 'right'` + `writingDirection: 'rtl'` often looks LTR (wrong edge).
      // Logical start for RTL script: align `left` when native layout is RTL, else `right`.
      const rtlFaBase: TextStyle | undefined = isFa
        ? {
            writingDirection: 'rtl',
            textAlign: I18nManager.isRTL ? 'left' : 'right',
          }
        : undefined;

      if (flat?.fontFamily) {
        return rtlFaBase ? [rtlFaBase, style] : style;
      }

      const family = getFontFamily(locale, fontWeightHintFromStyle(flat?.fontWeight));
      const baseFace: TextStyle = { fontFamily: family };
      const stack =
        flat?.fontWeight != null ? [baseFace, style, { fontWeight: 'normal' }] : [baseFace, style];
      return rtlFaBase ? [rtlFaBase, ...stack] : stack;
    }, [locale, style]);

    return <RNText ref={ref} style={resolvedStyle as RNTextProps['style']} {...rest} />;
  },
);
