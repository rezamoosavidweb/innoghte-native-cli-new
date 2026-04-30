import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  getExecuteDonationCom,
  getVerifyDonationIr,
} from '@/domains/donation/api/donationApi';
import {
  donationVerificationFingerprint,
  hasIranVerifyShape,
  hasPaypalVerifyShape,
  type PaymentGatewayParams,
} from '@/domains/donation/model/donationCallbackParams';
import type { DonationFlowState } from '@/domains/donation/model/donationFlowMachine';
import { donationKeys } from '@/domains/donation/model/queryKeys';

/**
 * IR + COM verify/execute queries + derived flags. Query keys and `enabled` match screen parity.
 */
export function useDonationVerificationQueries(args: {
  paymentParams: PaymentGatewayParams;
  isDotIr: boolean;
  verifyGateway: string;
  flowStatus: DonationFlowState['status'];
}) {
  const { paymentParams, isDotIr, verifyGateway, flowStatus } = args;

  const verificationFingerprint = useMemo(
    () => donationVerificationFingerprint(paymentParams),
    [paymentParams],
  );

  const canVerifyIranian = hasIranVerifyShape(paymentParams, isDotIr);
  const canVerifyPaypal = hasPaypalVerifyShape(paymentParams);
  const shouldVerify = canVerifyIranian || canVerifyPaypal;

  const authorityOrToken =
    paymentParams.authority ?? paymentParams.token ?? null;

  const iranQuery = useQuery({
    queryKey: donationKeys.verifyIr(
      verifyGateway,
      authorityOrToken,
      paymentParams.status,
    ),
    queryFn: () =>
      getVerifyDonationIr({
        gatewayName: verifyGateway,
        Authority: authorityOrToken!,
        Status: paymentParams.status!,
      }),
    enabled: canVerifyIranian && flowStatus === 'verifying',
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const paypalQuery = useQuery({
    queryKey: donationKeys.executeCom(
      verifyGateway,
      paymentParams.paymentId,
      paymentParams.payerID,
    ),
    queryFn: () =>
      getExecuteDonationCom({
        gatewayName: verifyGateway,
        paymentId: paymentParams.paymentId!,
        payerID: paymentParams.payerID!,
      }),
    enabled: canVerifyPaypal && flowStatus === 'verifying',
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  });

  return {
    verificationFingerprint,
    canVerifyIranian,
    canVerifyPaypal,
    shouldVerify,
    authorityOrToken,
    iranQuery,
    paypalQuery,
  };
}
