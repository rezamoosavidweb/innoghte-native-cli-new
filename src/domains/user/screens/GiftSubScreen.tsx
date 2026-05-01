import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import {
  flashListContentGutters,
  pickSemantic,
  createNavScreenShellStyles,
} from '@/ui/theme';

import { useGiftSubScreenStyles } from '@/domains/user/screens/giftSubScreen.styles';

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
  const shell = createNavScreenShellStyles(colors);

  const suffix = TITLE_SUFFIX[route.name];
  const title = t(`screens.gift.leaf.${suffix}.title`);
  const body = t(`screens.gift.leaf.${suffix}.body`);

  const s = useGiftSubScreenStyles(colors, semantic);

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
