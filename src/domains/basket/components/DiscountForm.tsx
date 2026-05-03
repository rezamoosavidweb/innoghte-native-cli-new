import * as React from 'react';
import {
  ActivityIndicator,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { navigateToLogin } from '@/app/bridge/auth/protectedNavigation';
import { AuthService } from '@/domains/auth';
import { useBasketCheckoutStore } from '@/domains/basket/model/basketCheckout.store';
import { ApiError } from '@/shared/infra/http/apiError';
import { showAppToast } from '@/shared/ui/toast/toastBus';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { useDiscountFormStyles } from '@/domains/basket/components/discountForm.styles';
import { useThemeColors } from '@/ui/theme';

const SUBMIT_DEBOUNCE_MS = 480;

type Props = {
  mutateValidateDiscount: (p: {
    discountCode: string;
    courseIds: number[];
  }) => Promise<unknown>;
  isPending: boolean;
  discountEligibleCourseIds: number[];
};

export const DiscountForm = React.memo(function DiscountForm({
  mutateValidateDiscount,
  isPending,
  discountEligibleCourseIds,
}: Props) {
  const colors = useThemeColors();
  const navigation = useAppNavigation();
  const [code, setCode] = React.useState('');
  const guardRef = React.useRef(false);
  const lastSubmitAt = React.useRef(0);

  const redirectToLoginForDiscount = React.useCallback(
    (discountCode: string) => {
      useBasketCheckoutStore.getState().setPendingDiscountCode(discountCode);
      AuthService.setPendingNavigation({
        name: 'Basket',
        params: { resumeCheckout: false },
      });
      navigateToLogin(navigation, {
        redirectTo: 'BasketScreen',
        preserveState: true,
      });
    },
    [navigation],
  );

  const onApply = React.useCallback(async () => {
    const trimmed = code.trim();
    const now = Date.now();
    if (now - lastSubmitAt.current < SUBMIT_DEBOUNCE_MS) {
      return;
    }
    lastSubmitAt.current = now;

    const shouldValidate = Boolean(trimmed) && discountEligibleCourseIds.length > 0;
    if (!shouldValidate) {
      return;
    }

    if (!AuthService.isAuthenticated()) {
      redirectToLoginForDiscount(trimmed);
      return;
    }

    if (guardRef.current || isPending) {
      return;
    }
    guardRef.current = true;
    try {
      await mutateValidateDiscount({
        discountCode: trimmed,
        courseIds: discountEligibleCourseIds,
      });
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.status === 401) {
          redirectToLoginForDiscount(trimmed);
        } else {
          showAppToast(e.message, 'error');
        }
      }
    } finally {
      guardRef.current = false;
    }
  }, [
    code,
    discountEligibleCourseIds,
    isPending,
    mutateValidateDiscount,
    redirectToLoginForDiscount,
  ]);

  const s = useDiscountFormStyles(colors);

  return (
    <View style={s.wrap}>
      <Text style={s.label}>اگر کد تخفیف دارید لطفا در زیر بنویسید.</Text>
      <View style={s.fieldRow}>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="کد تخفیف"
          placeholderTextColor={colors.textMuted}
          style={s.input}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={onApply}
          returnKeyType="done"
        />
        <Pressable
          onPress={onApply}
          style={[s.addBtn, isPending && s.addBtnDisabled]}
          disabled={isPending}
          accessibilityRole="button"
          accessibilityLabel="اعمال تخفیف"
        >
          <View style={s.addBtnSlot}>
            <View style={isPending ? s.addBtnLabelHidden : undefined}>
              <Text style={s.addLbl}>+</Text>
            </View>
            {isPending ? (
              <View
                style={s.addBtnLoaderOverlay}
                pointerEvents="none"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <ActivityIndicator color={colors.background} />
              </View>
            ) : null}
          </View>
        </Pressable>
      </View>
    </View>
  );
});
