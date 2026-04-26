import { getApiClient } from '@/shared/infra/http';
import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import { endpoints } from '@/shared/infra/http/endpoints';
import {
  clearAccessToken,
  setAccessToken,
} from '@/domains/auth/api/auth.storage';
import type {
  LoginBodyType,
  LoginResponse,
  RegisterBodyType,
  RegisterResponse,
  UserResponseType,
} from '@/domains/auth/model/apiTypes';

export async function login(body: LoginBodyType): Promise<LoginResponse> {
  const response = await parseJsonResponse<LoginResponse>(
    getApiClient().post(endpoints.auth.login.replace(/^\//, ''), { json: body }),
  );
  const token = response.data?.access_token;
  if (token) {
    setAccessToken(token);
  }
  return response;
}

export async function register(body: RegisterBodyType): Promise<RegisterResponse> {
  return parseJsonResponse<RegisterResponse>(
    getApiClient().post(endpoints.auth.register.replace(/^\//, ''), { json: body }),
  );
}

export async function getUser(): Promise<UserResponseType> {
  return parseJsonResponse<UserResponseType>(
    getApiClient().get(endpoints.auth.user.replace(/^\//, '')),
  );
}

export async function logout(): Promise<void> {
  try {
    await getApiClient().get(endpoints.auth.logout.replace(/^\//, ''));
  } finally {
    clearAccessToken();
  }
}
