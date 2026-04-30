import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { navigateToAppLeaf } from '@/app/bridge/auth/protectedNavigation';
import { useBasketCheckoutStore } from '@/domains/basket/model/basketCheckout.store';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { useThemeColors, fontSize, fontWeight, spacing } from '@/ui/theme';

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

  const s = React.useMemo(
    () =>
      StyleSheet.create({
        row: { flexDirection: 'row', alignItems: 'flex-start' },
        box: {
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: colors.primary,
          marginTop: 2,
          marginRight: spacing.sm,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: accepted ? colors.primary : 'transparent',
        },
        check: { color: colors.onPrimary, fontSize: 14, fontWeight: fontWeight.bold },
        copy: { flex: 1, fontSize: fontSize.sm + 1, fontWeight: fontWeight.medium, color: colors.text },
        link: { color: colors.primary, textDecorationLine: 'underline' },
      }),
    [accepted, colors],
  );

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
