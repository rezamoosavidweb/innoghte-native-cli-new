import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {ScrollView, View, StyleSheet} from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import {
  flashListContentGutters,
  fontSize,
  fontWeight,
  pickSemantic,
  useNavScreenShellStyles,
} from '@/ui/theme';

type GiftLeafName = 'GiftSend' | 'GiftReceived' | 'GiftSent';

type Props = DrawerScreenProps<DrawerParamList, GiftLeafName>;

const TITLE_SUFFIX: Record<GiftLeafName, 'send' | 'received' | 'sent'> = {
  GiftSend: 'send',
  GiftReceived: 'received',
  GiftSent: 'sent',
};

export const GiftSubScreen = React.memo(function GiftSubScreen({ route }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const semantic = pickSemantic(theme);
  const shell = useNavScreenShellStyles(colors);

  const suffix = TITLE_SUFFIX[route.name];
  const title = t(`screens.gift.leaf.${suffix}.title`);
  const body = t(`screens.gift.leaf.${suffix}.body`);

  const s = React.useMemo(
    () =>
      StyleSheet.create({
        title: {
          color: colors.text,
          fontSize: fontSize.lg,
          fontWeight: fontWeight.semibold,
        },
        body: {
          color: semantic.textMuted,
          marginTop: 12,
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
        <Text style={s.title}>{title}</Text>
        <Text style={s.body}>{body}</Text>
      </View>
    </ScrollView>
  );
});
GiftSubScreen.displayName = 'GiftSubScreen';
