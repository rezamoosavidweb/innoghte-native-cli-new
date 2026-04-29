import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import {
  flashListContentGutters,
  fontSize,
  fontWeight,
  pickSemantic,
  useNavScreenShellStyles,
} from '@/ui/theme';

type LegalLeaf = 'PurchaseHistory' | 'SupportServices' | 'Terms' | 'Copyright';

type Props = DrawerScreenProps<DrawerParamList, LegalLeaf>;

const LEAF_I18N: Record<
  LegalLeaf,
  { titleKey: string; bodyKey: string }
> = {
  PurchaseHistory: {
    titleKey: 'screens.support.placeholders.purchaseHistory.title',
    bodyKey: 'screens.support.placeholders.purchaseHistory.body',
  },
  SupportServices: {
    titleKey: 'screens.support.placeholders.supportServices.title',
    bodyKey: 'screens.support.placeholders.supportServices.body',
  },
  Terms: {
    titleKey: 'screens.support.placeholders.terms.title',
    bodyKey: 'screens.support.placeholders.terms.body',
  },
  Copyright: {
    titleKey: 'screens.support.placeholders.copyright.title',
    bodyKey: 'screens.support.placeholders.copyright.body',
  },
};

export const SupportLegalPlaceholderScreen = React.memo(
  function SupportLegalPlaceholderScreen({ route }: Props) {
    const { t } = useTranslation();
    const { colors, dark } = useTheme();
    const semantic = pickSemantic(dark);
    const shell = useNavScreenShellStyles(colors);

    const keys = LEAF_I18N[route.name];

    const s = React.useMemo(
      () =>
        StyleSheet.create({
          title: {
            color: colors.text,
            fontSize: fontSize.lg,
            fontWeight: fontWeight.semibold,
            marginBottom: 8,
          },
          body: {
            color: semantic.textMuted,
            lineHeight: fontSize.base * 1.45,
            fontSize: fontSize.base,
          },
        }),
      [colors.text, semantic.textMuted],
    );

    return (
      <ScrollView
        contentContainerStyle={flashListContentGutters.standard}
        keyboardShouldPersistTaps="handled"
      >
        <View style={shell.safe}>
          <Text style={s.title}>{t(keys.titleKey)}</Text>
          <Text style={s.body}>{t(keys.bodyKey)}</Text>
        </View>
      </ScrollView>
    );
  },
);
SupportLegalPlaceholderScreen.displayName = 'SupportLegalPlaceholderScreen';
