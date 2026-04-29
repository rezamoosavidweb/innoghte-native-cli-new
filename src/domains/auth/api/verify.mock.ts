import { z } from 'zod';

import { getUser } from '@/domains/auth/api/auth.service';
import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import type { VerifyChannel } from '@/shared/contracts/verification';

const flexibleAuthResponseSchema = z
  .object({
    message: z.string().optional(),
    data: z.unknown().optional(),
  })
  .passthrough();

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/**
 * Dev-only simulated OTP; release builds use resend/check endpoints below.
 */
export async function sendVerificationCode(
  channel: VerifyChannel,
  destination: string,
): Promise<void> {
  const trimmed = destination.trim();
  if (!trimmed) {
    throw new Error('EMPTY_DESTINATION');
  }
  if (channel === 'email' && !trimmed.includes('@')) {
    throw new Error('INVALID_EMAIL');
  }
  if (channel === 'mobile' && trimmed.length < 8) {
    throw new Error('INVALID_MOBILE');
  }

  if (__DEV__) {
    await delay(480);
    return;
  }

  const body =
    channel === 'email'
      ? { type: 'email' as const, email: trimmed }
      : { type: 'mobile' as const, mobile: trimmed };

  await parseJsonResponse(
    getApiClient().post(endpoints.auth.resendVerifyOtp, { json: body }),
    flexibleAuthResponseSchema,
  );
}

export async function verifyCodeWithServer(
  channel: VerifyChannel,
  destination: string,
  code: string,
): Promise<void> {
  const c = code.trim();
  if (!c) {
    throw new Error('EMPTY_CODE');
  }

  if (__DEV__) {
    await delay(420);
    if (c !== '123456') {
      throw new Error('INVALID_CODE');
    }
    void channel;
    void destination;
    return;
  }

  const trimmedDest = destination.trim();
  const userRes = await getUser();
  const user = userRes.data;

  const body = {
    otp: c,
    email_identifier: channel === 'email' ? trimmedDest : user.email,
    mobile_identifier: channel === 'mobile' ? trimmedDest : user.mobile,
  };

  await parseJsonResponse(
    getApiClient().post(endpoints.auth.checkOtp, { json: body }),
    flexibleAuthResponseSchema,
  );
}
