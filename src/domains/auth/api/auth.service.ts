import { queryClient } from '@/app/queryClient';
import { AUTH_USER_QUERY_KEY } from '@/domains/auth/model/queryKeys';
import {
  loginResponseSchema,
  registerResponseSchema,
  userResponseSchema,
} from '@/domains/auth/model/authHttp.schemas';
import { useAuthStore } from '@/domains/auth/model/auth.store';
import { resetAuth401LoginNavigationGuard } from '@/shared/infra/auth401/loginNavigationGuard';
import { withKyAuth401Context } from '@/shared/infra/auth401/kyContext';
import { endpoints } from '@/shared/infra/http/endpoints';
import { fireAndForget, getApiClient } from '@/shared/infra/http';
import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import type {
  CheckotpBodyType,
  LoginBodyType,
  LoginResponse,
  RegisterBodyType,
  RegisterResponse,
  ResendVerifyOtpBodyType,
  UserResponseType,
} from '@/domains/auth/model/apiTypes';

function applyAuthToken(token: string | undefined): void {
  if (!token) return;
  useAuthStore.getState().setAuth({ accessToken: token });
  resetAuth401LoginNavigationGuard();
  fireAndForget(queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY }));
}

export async function login(body: LoginBodyType): Promise<LoginResponse> {
  const response = await parseJsonResponse(
    getApiClient().post(endpoints.auth.login, { json: body }),
    loginResponseSchema,
  );
  applyAuthToken(response.data?.access_token);
  return response;
}

export async function register(
  body: RegisterBodyType,
): Promise<RegisterResponse> {
  const response = await parseJsonResponse(
    getApiClient().post(endpoints.auth.register, { json: body }),
    registerResponseSchema,
  );
  applyAuthToken(response.data?.access_token);
  return response;
}

export async function getUser(): Promise<UserResponseType> {
  return parseJsonResponse(
    getApiClient().get(
      endpoints.auth.user,
      withKyAuth401Context({
        strategy: 'login_only',
        redirectToLogin: true,
      }),
    ),
    userResponseSchema,
  );
}

/**
 * Fetch user profile during app bootstrap (SplashScreen).
 * Uses no_redirect so the caller handles all auth failures — avoids a race
 * between the 401 handler navigation and the SplashScreen's own redirect.
 */
export async function getUserForSplash(): Promise<UserResponseType> {
  return parseJsonResponse(
    getApiClient().get(
      endpoints.auth.user,
      withKyAuth401Context({
        strategy: 'no_redirect',
        redirectToLogin: false,
      }),
    ),
    userResponseSchema,
  );
}

export async function checkOtp(body: CheckotpBodyType): Promise<void> {
  await getApiClient().post(endpoints.auth.checkOtp, { json: body });
}

export async function resendVerifyOtp(body: ResendVerifyOtpBodyType): Promise<void> {
  await getApiClient().post(endpoints.auth.resendVerifyOtp, { json: body });
}

export async function logout(): Promise<void> {
  try {
    await getApiClient().get(endpoints.auth.logout);
  } finally {
    queryClient.clear();
    useAuthStore.getState().logout();
    resetAuth401LoginNavigationGuard();
  }
}
