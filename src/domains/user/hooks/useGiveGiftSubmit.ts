import type { UseFormReturn } from 'react-hook-form';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  looksLikeLegacyPurchasedCoursesErrorPayload,
  mergePurchasedTitlesFromLegacyPresentError,
  purchasedCoursesMessageFromTitles,
} from '@/domains/user/api/giveGiftApi';
import type { GiveGiftFormType } from '@/domains/user/model/giveGiftFormSchema';
import { completeGiveGiftFlow } from '@/domains/user/services/completeGiveGiftFlow';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { ApiError } from '@/shared/infra/http';
import { showAppToast } from '@/shared/ui/toast';

type Options = {
  form: Pick<
    UseFormReturn<GiveGiftFormType>,
    'getValues' | 'handleSubmit' | 'formState'
  >;
  isDotIr: boolean;
  requestScrollToMobile: () => void;
};

export function useGiveGiftSubmit({
  form,
  isDotIr,
  requestScrollToMobile,
}: Options) {
  const { t } = useTranslation();
  const navigation = useAppNavigation();
  const { getValues, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  const [loading, setLoading] = React.useState(false);
  const [purchasedError, setPurchasedError] = React.useState('');

  const onSubmit = React.useCallback(async () => {
    try {
      setLoading(true);
      const formData = getValues();
      const selectedProducts = [
        ...(formData.selectionGroup?.courses ?? []),
        ...(formData.selectionGroup?.albums ?? []),
        ...(formData.selectionGroup?.rooyeKhats ?? []),
        ...(formData.selectionGroup?.audioBooks ?? []),
      ].map(id => Number(id));

      const body = {
        receiver_first_name: formData.name,
        receiver_last_name: formData.family,
        receiver_email: formData.email,
        receiver_mobile: `00${formData.mobile.dial}`,
        message: formData.comment,
        course_ids: selectedProducts,
      };

      await completeGiveGiftFlow(body, selectedProducts);

      showAppToast(t('screens.giveGift.successToast'), 'success');
      navigation.navigate('GiftScreen');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (looksLikeLegacyPurchasedCoursesErrorPayload(error)) {
        const apiErr = error as ApiError;
        const titles = mergePurchasedTitlesFromLegacyPresentError(
          apiErr.payload,
          isDotIr,
        );
        const msg = purchasedCoursesMessageFromTitles(titles);
        if (msg) setPurchasedError(msg);
        requestScrollToMobile();
        return;
      }
    }
  }, [getValues, isDotIr, navigation, requestScrollToMobile, t]);

  const onError = React.useCallback(() => {
    if (__DEV__) {
      console.log({ getValues: getValues(), errors }, 'in error mode');
    }
  }, [errors, getValues]);

  const handleSubmitPress = React.useCallback(() => {
    handleSubmit(onSubmit, onError)().catch(() => undefined);
  }, [handleSubmit, onSubmit, onError]);

  const interactionBusy = loading || isSubmitting;

  return {
    loading,
    purchasedError,
    setPurchasedError,
    handleSubmitPress,
    interactionBusy,
  };
}
