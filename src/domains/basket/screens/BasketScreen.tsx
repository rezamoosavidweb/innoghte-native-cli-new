import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { RouteProp } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import {ActivityIndicator, Alert, ScrollView, View} from 'react-native';
import { Text } from '@/shared/ui/Text';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { navigateToAppLeaf, navigateToLogin } from '@/app/bridge/auth';
import { AuthService, useIsAuthenticated } from '@/domains/auth';
import { deleteCartByToken } from '@/domains/basket/api/basketApi';
import { CartHeader } from '@/domains/basket/components/CartHeader';
import { CartList } from '@/domains/basket/components/CartList';
import { CheckoutButton } from '@/domains/basket/components/CheckoutButton';
import { DiscountForm } from '@/domains/basket/components/DiscountForm';
import { EmptyBasket } from '@/domains/basket/components/EmptyBasket';
import { PaymentSection } from '@/domains/basket/components/PaymentSection';
import { TermsCheckbox } from '@/domains/basket/components/TermsCheckbox';
import { useBasketCart } from '@/domains/basket/hooks/useBasketCart';
import {
  useDiscountEligibleCourseIds,
  usePayableCourseIds,
} from '@/domains/basket/hooks/useBasketCourseIds';
import { useBasketPaymentMutation } from '@/domains/basket/hooks/useBasketPaymentMutation';
import { useBasketTotals } from '@/domains/basket/hooks/useBasketTotals';
import { useGiftPresentFromStorage } from '@/domains/basket/hooks/useGiftPresentFromStorage';
import { useBasketCheckoutStore } from '@/domains/basket/model/basketCheckout.store';
import { useBasketDiscountStore } from '@/domains/basket/model/basketDiscount.store';
import {
  basketPaymentFormResolver,
  type BasketPaymentFormType,
} from '@/domains/basket/model/paymentFormSchema';
import { buildBasketPaymentPayload } from '@/domains/basket/services/buildBasketPaymentPayload';
import { openExternalPaymentUrl } from '@/domains/basket/services/openExternalPaymentUrl';
import { formatTomanFa } from '@/domains/basket/utils/formatTomanFa';
import { isDotIr } from '@/shared/config/resolveIsDotIr';
import type {
  DrawerParamList,
  TabParamList,
} from '@/shared/contracts/navigationApp';
import { ApiError } from '@/shared/infra/http/apiError';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { useThemeColors } from '@/ui/theme';
import { createBasketScreenStyles } from './basketScreen.styles';

export type BasketScreenRouteProp =
  | RouteProp<DrawerParamList, 'Basket'>
  | RouteProp<TabParamList, 'Cart'>;

function redirectToLoginForCheckout(
  navigation: ReturnType<typeof useAppNavigation>,
): void {
  AuthService.setPendingNavigation({
    name: 'Basket',
    params: { resumeCheckout: true },
  });
  useBasketCheckoutStore.getState().prepareLoginRedirect();
  navigateToLogin(navigation, {
    redirectTo: 'BasketScreen',
    preserveState: true,
  });
}

function BasketScreenInner({ route }: { route: BasketScreenRouteProp }) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const isAuthed = useIsAuthenticated();
  const gift = useGiftPresentFromStorage();
  const {
    cartList,
    cartToken,
    isPendingList,
    refetchCart,
    removeCartLine,
    mutateValidateDiscount,
    isPendingValidateDiscount,
  } = useBasketCart();
  const discount = useBasketDiscountStore(s => s.discount);
  const setDiscount = useBasketDiscountStore(s => s.setDiscount);
  const payableIds = usePayableCourseIds(cartList, gift.giftsCourseIds);
  const discountIds = useDiscountEligibleCourseIds(cartList);
  const totals = useBasketTotals(cartList, gift.giftsCourseIds, discount);
  const gateway = useBasketCheckoutStore(s => s.gatewayName);
  const termsAccepted = useBasketCheckoutStore(s => s.termsAccepted);
  const pendingDiscountCode = useBasketCheckoutStore(
    s => s.pendingDiscountCode,
  );
  const paymentMutation = useBasketPaymentMutation();

  const form = useForm<BasketPaymentFormType>({
    resolver: basketPaymentFormResolver,
    defaultValues: { paymentType: 'paypal' },
  });

  const paymentType = form.watch('paymentType');

  const resetPaymentForm = React.useCallback(
    (next: 'paypal' | 'credit_card') => {
      if (next === 'credit_card') {
        form.reset({
          paymentType: 'credit_card',
          cart: {
            fistName: '',
            lastName: '',
            cardType: '1',
            cardNumber: '',
            expireMonth: '',
            expireYear: '',
            cvv: '',
          },
        });
      } else {
        form.reset({ paymentType: 'paypal' });
      }
    },
    [form],
  );

  const onPaymentTypeChange = React.useCallback(
    (next: 'paypal' | 'credit_card') => {
      useBasketCheckoutStore.getState().setPaymentMethod(next);
      resetPaymentForm(next);
    },
    [resetPaymentForm],
  );

  const didRestorePaymentMethodRef = React.useRef(false);
  const didAutoResumeRef = React.useRef(false);
  React.useEffect(() => {
    if (!route.params?.resumeCheckout) {
      didRestorePaymentMethodRef.current = false;
      didAutoResumeRef.current = false;
    }
  }, [route.params?.resumeCheckout]);

  React.useEffect(() => {
    if (!route.params?.resumeCheckout || didRestorePaymentMethodRef.current) {
      return;
    }
    didRestorePaymentMethodRef.current = true;
    const pm = useBasketCheckoutStore.getState().paymentMethod;
    resetPaymentForm(pm ?? 'paypal');
  }, [route.params?.resumeCheckout, resetPaymentForm]);

  useFocusEffect(
    React.useCallback(() => {
      refetchCart().catch(() => {});
    }, [refetchCart]),
  );

  React.useEffect(() => {
    if (!isAuthed || !pendingDiscountCode || discountIds.length === 0) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await mutateValidateDiscount({
          discountCode: pendingDiscountCode,
          courseIds: discountIds,
        });
        if (!cancelled) {
          useBasketCheckoutStore.getState().setPendingDiscountCode(null);
        }
      } catch {
        /* Interactive apply uses DiscountForm for user-visible errors */
      }
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isAuthed, pendingDiscountCode, discountIds, mutateValidateDiscount]);

  const payAndOpenUrl = React.useCallback(
    async (data: BasketPaymentFormType) => {
      const body = buildBasketPaymentPayload({
        payableCourseIds: payableIds,
        giftsCourseIds: gift.giftsCourseIds,
        presentId: gift.presentId,
        gateway,
        paymentMethod: data.paymentType,
        discount,
        form: data,
      });
      const result = await paymentMutation.mutateAsync(body);
      const url = result.data?.url;
      if (url) {
        if (cartToken) {
          deleteCartByToken(cartToken).catch(() => {});
        }
        setDiscount(null);
        await openExternalPaymentUrl(url);
      }
    },
    [
      cartToken,
      discount,
      gateway,
      gift.giftsCourseIds,
      gift.presentId,
      payableIds,
      paymentMutation,
      setDiscount,
    ],
  );

  const onSubmit = React.useCallback(
    async (data: BasketPaymentFormType) => {
      if (!AuthService.isAuthenticated()) {
        redirectToLoginForCheckout(navigation);
        return;
      }
      if (!termsAccepted) {
        Alert.alert('خطا', 'لطفا قوانین و مقررات را بپذیرید.');
        return;
      }
      if (payableIds.length === 0) {
        Alert.alert('خطا', 'لطفا دوره‌ای را به سبد خرید اضافه کنید.');
        return;
      }
      try {
        await payAndOpenUrl(data);
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          redirectToLoginForCheckout(navigation);
          return;
        }
        const msg = e instanceof ApiError ? e.message : 'پرداخت انجام نشد.';
        Alert.alert('خطا', msg);
      }
    },
    [navigation, payAndOpenUrl, payableIds.length, termsAccepted],
  );

  const submitHandler = React.useMemo(
    () => form.handleSubmit(onSubmit),
    [form, onSubmit],
  );

  React.useEffect(() => {
    if (!route.params?.resumeCheckout || !isAuthed || isPendingList) {
      return;
    }
    if (!useBasketCheckoutStore.getState().autoResumeCheckout) {
      return;
    }
    if (pendingDiscountCode) {
      return;
    }
    if (didAutoResumeRef.current) {
      return;
    }
    didAutoResumeRef.current = true;
    submitHandler()
      .finally(() => {
        useBasketCheckoutStore.getState().setAutoResumeCheckout(false);
      })
      .catch(() => {});
  }, [
    route.params?.resumeCheckout,
    isAuthed,
    isPendingList,
    pendingDiscountCode,
    submitHandler,
  ]);

  const onRemove = React.useCallback(
    async (cartLineId: number) => {
      try {
        await removeCartLine(cartLineId);
      } catch {
        Alert.alert('خطا', 'حذف سبد انجام نشد.');
      }
    },
    [removeCartLine],
  );

  const onViewCourse = React.useCallback(
    (_courseId: number) => {
      navigateToAppLeaf(navigation, 'PublicCourses');
    },
    [navigation],
  );

  const s = createBasketScreenStyles(colors, insets.bottom);

  if (!isPendingList && cartList.length === 0) {
    return (
      <SafeAreaView style={s.flex} edges={['top', 'left', 'right']}>
        <View style={[s.scroll, s.emptyWrap]}>
          <CartHeader title="سبد خرید" />
          <EmptyBasket />
        </View>
      </SafeAreaView>
    );
  }

  const showStrike = totals.displayPrice !== totals.displayDiscountPrice;

  return (
    <SafeAreaView style={s.flex} edges={['top', 'left', 'right']}>
      {isPendingList ? (
        <View style={s.loading}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <ScrollView
            style={s.flex}
            contentContainerStyle={[s.scroll, s.scrollContentBottom]}
            keyboardShouldPersistTaps="handled"
          >
            <CartHeader title="سفارش شما" />
            <View style={s.card}>
              <View style={s.rowBetween}>
                <Text style={s.muted}>محصول</Text>
                <Text style={s.muted}>جمع کل</Text>
              </View>
              <CartList
                cartList={cartList}
                giftsCourseIds={gift.giftsCourseIds}
                onRemove={onRemove}
                onViewCourse={onViewCourse}
              />
              <View style={s.rowBetween}>
                <Text style={s.muted}>قیمت نهایی</Text>
                <View style={s.priceRow}>
                  {showStrike ? (
                    <Text style={s.strike}>
                      {formatTomanFa(totals.displayPrice)}
                    </Text>
                  ) : null}
                  <Text style={s.total}>
                    {formatTomanFa(totals.displayDiscountPrice)}
                  </Text>
                </View>
              </View>
            </View>

            <DiscountForm
              mutateValidateDiscount={mutateValidateDiscount}
              isPending={isPendingValidateDiscount}
              discountEligibleCourseIds={discountIds}
            />

            <View style={[s.banner, s.bannerInfo]}>
              <Text style={s.bannerTxtInfo}>
                لطفا در نظر داشته باشید که دوره‌های مجموعه «این نقطه» در قالب
                اشتراک آنلاین ارائه می‌شود.
              </Text>
            </View>
            {isDotIr ? (
              <View style={[s.banner, s.bannerWarn]}>
                <Text style={s.bannerTxtWarn}>
                  بعد از خرید، اشتراک شما تنها در جهت استفاده در کشور ایران فعال
                  خواهد بود.
                </Text>
              </View>
            ) : null}

            <View style={s.card}>
              <PaymentSection
                control={form.control}
                errors={form.formState.errors}
                paymentType={paymentType}
                onPaymentTypeChange={onPaymentTypeChange}
              />
            </View>
          </ScrollView>
          <View style={s.footer}>
            <TermsCheckbox />
            <CheckoutButton
              onPress={submitHandler}
              loading={paymentMutation.isPending}
              disabled={payableIds.length === 0}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

type BasketScreenProps =
  | DrawerScreenProps<DrawerParamList, 'Basket'>
  | BottomTabScreenProps<TabParamList, 'Cart'>;

const BasketScreenComponent = (props: BasketScreenProps) => (
  <BasketScreenInner route={props.route} />
);

export const BasketScreen = React.memo(BasketScreenComponent);
BasketScreen.displayName = 'BasketScreen';
