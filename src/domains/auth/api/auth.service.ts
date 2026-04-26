import { getApiClient } from '@/shared/infra/http';
import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import { endpoints } from '@/shared/infra/http/endpoints';
import { loginResponseSchema, userResponseSchema } from '@/domains/auth/model/authHttp.schemas';
import { useAuthStore } from '@/domains/auth/model/auth.store';
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
  }
  return response;
}

export async function register(body: RegisterBodyType): Promise<RegisterResponse> {
  return parseJsonResponse<RegisterResponse>(
    getApiClient().post(endpoints.auth.register, { json: body }),
  );
}

export async function getUser(): Promise<UserResponseType> {
  return parseJsonResponse(
    getApiClient().get(endpoints.auth.user),
    userResponseSchema,
  );
}

export async function logout(): Promise<void> {
  try {
    await getApiClient().get(endpoints.auth.logout);
  } finally {
    useAuthStore.getState().logout();
  }
}
