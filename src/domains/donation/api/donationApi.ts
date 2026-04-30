/**
 * Public donation payment API — paths relative to HTTP client prefix
 * ({@link resolveApiBaseUrl}: `API_BASE_URL` / `REACT_NATIVE_API_URL`).
 */
import { parseJsonResponse } from '@/shared/infra/http';
import { getApiClient } from '@/shared/infra/http/appHttpClient';

import {
  donationActionResponseSchema,
  publicDonationResponseSchema,
} from '@/domains/donation/model/donationHttp.schemas';
import { resolveIsDotIr } from '@/domains/donation/model/env';
import type {
  CreateDonationComBodyTypes,
  CreateDonationIrBodyTypes,
  PublicDonationResponse,
} from '@/domains/donation/model/types';

const paths = {
  createIr: 'api/v1/donate/payment/create',
  verifyIr: 'api/v1/donate/payment/result',
  createCom: 'api/v1/donate/payment/paypal/create',
  executeCom: 'api/v1/donate/payment/paypal/execute-payment',
} as const;

function scopeHeader(): { Scope: 'ir' | 'com' } {
  return { Scope: resolveIsDotIr() ? 'ir' : 'com' };
}

export async function postCreateDonationIr(
  body: CreateDonationIrBodyTypes,
): Promise<PublicDonationResponse> {
  return parseJsonResponse(
    getApiClient().post(paths.createIr, {
      json: body,
      headers: scopeHeader(),
    }),
    publicDonationResponseSchema,
  );
}

export async function postCreateDonationCom(
  body: CreateDonationComBodyTypes,
): Promise<PublicDonationResponse> {
  return parseJsonResponse(
    getApiClient().post(paths.createCom, {
      json: body,
      headers: scopeHeader(),
    }),
    publicDonationResponseSchema,
  );
}

export async function getVerifyDonationIr(paramsData: {
  gatewayName: string;
  Authority: string;
  Status: string;
}): Promise<Record<string, unknown>> {
  const searchParams = new URLSearchParams({
    gateway_name: paramsData.gatewayName,
    Authority: paramsData.Authority,
    Status: paramsData.Status,
  });
  return parseJsonResponse(
    getApiClient().get(`${paths.verifyIr}?${searchParams}`),
    donationActionResponseSchema,
  );
}

export async function getExecuteDonationCom(paramsData: {
  gatewayName: string;
  paymentId: string;
  payerID: string;
}): Promise<Record<string, unknown>> {
  const searchParams = new URLSearchParams({
    gateway_name: paramsData.gatewayName,
    paymentId: paramsData.paymentId,
    PayerID: paramsData.payerID,
  });
  return parseJsonResponse(
    getApiClient().get(`${paths.executeCom}?${searchParams}`),
    donationActionResponseSchema,
  );
}
