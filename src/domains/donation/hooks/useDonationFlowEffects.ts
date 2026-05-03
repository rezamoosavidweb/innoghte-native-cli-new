import * as React from 'react';
import { useLayoutEffect } from 'react';
import type { QueryObserverResult } from '@tanstack/react-query';
import { Linking } from 'react-native';

import type {
  DonationFlowEvent,
  DonationFlowState,
} from '@/domains/donation/model/donationFlowMachine';
import { DONATION_LAST_CHECKOUT_GATEWAY_KEY } from '@/domains/donation/model/storageKeys';
import { StorageService } from '@/shared/infra/storage/storage.service';

type DonationFlowSend = (event: DonationFlowEvent) => void;

type QueryLike = Pick<
  QueryObserverResult<unknown, Error>,
  'isSuccess' | 'isError'
>;

/**
 * Single place for donation flow side effects: redirect, verification scheduling,
 * query settlement → modal + storage (via callbacks).
 */
export function useDonationFlowEffects(args: {
  flow: DonationFlowState;
  send: DonationFlowSend;
  verificationFingerprint: string | null;
  shouldVerify: boolean;
  canVerifyIranian: boolean;
  iranQuery: QueryLike;
  paypalQuery: QueryLike;
  openResult: (payload: {
    variant: 'success' | 'error';
    title: string;
    bodyLines: string[];
  }) => void;
  onGatewayVerifySuccess: () => void;
  onGatewayVerifyPaymentError: () => void;
}) {
  const {
    flow,
    send,
    verificationFingerprint,
    shouldVerify,
    canVerifyIranian,
    iranQuery,
    paypalQuery,
    openResult,
    onGatewayVerifySuccess,
    onGatewayVerifyPaymentError,
  } = args;

  const checkoutUrl = flow.status === 'checkout_ready' ? flow.url : null;
  const checkoutGateway =
    flow.status === 'checkout_ready' ? flow.gateway : null;

  const redirectStartedRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (flow.status === 'idle') {
      redirectStartedRef.current = null;
    }
  }, [flow.status]);

  useLayoutEffect(() => {
    if (checkoutUrl == null || checkoutGateway == null) return;
    const key = `${checkoutUrl}\0${checkoutGateway}`;
    if (redirectStartedRef.current === key) return;
    redirectStartedRef.current = key;

    StorageService.set(DONATION_LAST_CHECKOUT_GATEWAY_KEY, checkoutGateway);
    send({ type: 'REDIRECTED' });

    Linking.openURL(checkoutUrl).catch(() => {
      StorageService.remove(DONATION_LAST_CHECKOUT_GATEWAY_KEY);
      send({ type: 'CHECKOUT_ERROR' });
      openResult({
        variant: 'error',
        title: 'خطا',
        bodyLines: ['خطا در باز کردن صفحه پرداخت. لطفا دوباره تلاش کنید.'],
      });
    });
  }, [checkoutGateway, checkoutUrl, openResult, send]);

  const flowVerificationKey =
    flow.status === 'verifying' ? flow.verificationKey : undefined;

  useLayoutEffect(() => {
    if (!verificationFingerprint || !shouldVerify) return;
    if (flow.status === 'success' || flow.status === 'error') return;
    if (flowVerificationKey === verificationFingerprint) return;
    send({ type: 'START_VERIFICATION', key: verificationFingerprint });
  }, [
    flow.status,
    flowVerificationKey,
    shouldVerify,
    verificationFingerprint,
    send,
  ]);

  const activeQueryIsSuccess = canVerifyIranian
    ? iranQuery.isSuccess
    : paypalQuery.isSuccess;
  const activeQueryIsError = canVerifyIranian
    ? iranQuery.isError
    : paypalQuery.isError;

  React.useEffect(() => {
    if (!shouldVerify || !verificationFingerprint) return;
    if (flow.status !== 'verifying') return;

    if (activeQueryIsSuccess) {
      send({ type: 'VERIFICATION_SUCCESS' });
      onGatewayVerifySuccess();
    } else if (activeQueryIsError) {
      send({ type: 'VERIFICATION_ERROR' });
      onGatewayVerifyPaymentError();
    }
  }, [
    flow.status,
    activeQueryIsSuccess,
    activeQueryIsError,
    onGatewayVerifyPaymentError,
    onGatewayVerifySuccess,
    send,
    shouldVerify,
    verificationFingerprint,
  ]);
}
