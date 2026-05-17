import { useNavigation } from '@react-navigation/native';
import { HeaderButton } from '@react-navigation/elements';
import * as React from 'react';
import { I18nManager } from 'react-native';

import { Text } from '@/shared/ui/Text';
import { headerButtonStyles } from './headerButton.styles';

type Props = { tintColor?: string };

// Evaluated once at module load — RTL never changes without a full app restart.
const BACK_ARROW = I18nManager.isRTL ? '→' : '←';

export const HeaderBackButton = React.memo(function HeaderBackButton({
  tintColor,
}: Props) {
  const navigation = useNavigation();

  const handlePress = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (!navigation.canGoBack()) return null;

  return (
    <HeaderButton accessibilityLabel="Go back" onPress={handlePress}>
      <Text style={[headerButtonStyles.backIcon, { color: tintColor }]}>
        {BACK_ARROW}
      </Text>
    </HeaderButton>
  );
});
HeaderBackButton.displayName = 'HeaderBackButton';
