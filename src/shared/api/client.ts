import ky, { HTTPError } from 'ky';

import { clearAccessToken, getAccessToken } from '@/shared/api/modules/auth.storage';

type ApiErrorPayload = {
  message?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

function resolveApiBaseUrl(): string {
  const env =
    (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ??
    {};

  return env.API_BASE_URL ?? env.REACT_NATIVE_API_URL ?? 'https://apistg.innoghte.ir';
}

export const apiClient = ky.create({
  prefix: resolveApiBaseUrl(),
  timeout: 15000,
  retry: {
    limit: 1,
    methods: ['get'],
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        request.headers.set('Accept', 'application/json');
        request.headers.set('Content-Type', 'application/json');
        const token = getAccessToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    beforeError: [
      async state => {
        if (!(state.error instanceof HTTPError)) {
          return state.error;
        }

        let payload: ApiErrorPayload | undefined;
        try {
          payload = (await state.error.response.clone().json()) as ApiErrorPayload;
        } catch {
          payload = undefined;
        }

        if (state.error.response.status === 401) {
          clearAccessToken();
        }

        const message =
          payload?.message ?? `Request failed with status ${state.error.response.status}`;
        return new ApiError(message, state.error.response.status, payload);
      },
    ],
  },
});

export async function parseJsonResponse<T>(request: Promise<Response>): Promise<T> {
  const response = await request;
  return (await response.json()) as T;
}
