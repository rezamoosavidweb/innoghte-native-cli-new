import { apiClient, parseJsonResponse } from '@/shared/api/client';
import { endpoints } from '@/shared/api/endpoints';
import { clearAccessToken, setAccessToken } from '@/shared/api/modules/auth.storage';
import type {
  LoginBodyType,
  LoginResponse,
  RegisterBodyType,
  RegisterResponse,
  UserResponseType,
} from '@/shared/api/types/auth';

export async function login(body: LoginBodyType): Promise<LoginResponse> {
  const response = await parseJsonResponse<LoginResponse>(
    apiClient.post(endpoints.auth.login.replace(/^\//, ''), { json: body }),
  );
  const token = response.data?.access_token;
  if (token) {
    setAccessToken(token);
  }
  return response;
}

export async function register(body: RegisterBodyType): Promise<RegisterResponse> {
  return parseJsonResponse<RegisterResponse>(
    apiClient.post(endpoints.auth.register.replace(/^\//, ''), { json: body }),
  );
}

export async function getUser(): Promise<UserResponseType> {
  return parseJsonResponse<UserResponseType>(
    apiClient.get(endpoints.auth.user.replace(/^\//, '')),
  );
}

export async function logout(): Promise<void> {
  try {
    await apiClient.get(endpoints.auth.logout.replace(/^\//, ''));
  } finally {
    clearAccessToken();
  }
}
