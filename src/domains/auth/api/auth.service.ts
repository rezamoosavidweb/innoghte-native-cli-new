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
import { getApiClient } from '@/shared/infra/http';
import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import type {
  LoginBodyType,
  LoginResponse,
  RegisterBodyType,
  RegisterResponse,
  UserResponseType,
} from '@/domains/auth/model/apiTypes';

export async function login(body: LoginBodyType): Promise<LoginResponse> {
  const response = await parseJsonResponse(
    getApiClient().post(endpoints.auth.login, { json: body }),
    loginResponseSchema,
  );
  const token = response.data?.access_token;
  if (token) {
    useAuthStore.getState().setAuth({ accessToken: token });
    resetAuth401LoginNavigationGuard();
    queryClient
      .invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY })
      .catch(() => {});
  }
  return response;
}

export async function register(
  body: RegisterBodyType,
): Promise<RegisterResponse> {
  return parseJsonResponse(
    getApiClient().post(endpoints.auth.register, { json: body }),
    registerResponseSchema,
  );
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

export async function logout(): Promise<void> {
  try {
    await getApiClient().get(endpoints.auth.logout);
  } finally {
    queryClient.removeQueries({ queryKey: AUTH_USER_QUERY_KEY });
    useAuthStore.getState().logout();
    resetAuth401LoginNavigationGuard();
  }
}
