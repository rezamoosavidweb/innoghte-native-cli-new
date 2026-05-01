import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { navigateToAppLeaf } from '@/app/bridge/auth/protectedNavigation';
import { useBasketCheckoutStore } from '@/domains/basket/model/basketCheckout.store';
import { useTermsCheckboxStyles } from '@/domains/basket/components/termsCheckbox.styles';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { useThemeColors } from '@/ui/theme';

export const TermsCheckbox = React.memo(function TermsCheckbox() {
  const colors = useThemeColors();
  const navigation = useAppNavigation();
  const accepted = useBasketCheckoutStore(s => s.termsAccepted);
  const setAccepted = useBasketCheckoutStore(s => s.setTermsAccepted);

  const onToggle = React.useCallback(() => {
    setAccepted(!accepted);
  }, [accepted, setAccepted]);

  const onTerms = React.useCallback(() => {
    navigateToAppLeaf(navigation, 'Terms');
  }, [navigation]);

  const s = useTermsCheckboxStyles(colors, accepted);

  return (
    <View style={s.row}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: accepted }}
        hitSlop={8}
      >
        <View style={s.box}>{accepted ? <Text style={s.check}>✓</Text> : null}</View>
      </Pressable>
      <Text style={s.copy}>
        من <Text onPress={onTerms} style={s.link}>قوانین ارائه خدمت</Text> وب‌سایت را
        خوانده‌ام و آن را می‌پذیرم.
      </Text>
    </View>
  );
});
