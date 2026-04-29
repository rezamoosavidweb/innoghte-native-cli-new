import ky, { HTTPError, type Options } from 'ky';

import { ApiError, type ApiErrorPayload } from '@/shared/infra/http/apiError';
import { resolveApiBaseUrl } from '@/shared/infra/http/resolveBaseUrl';

export type UnauthorizedHookDetail = {
  /** Ky normalized `context` (includes per-request `auth401` policy when set). */
  kyContext: Record<string, unknown>;
};

export type HttpAuthHooks = {
  getAccessToken: () => string | null;
  onUnauthorized: (detail: UnauthorizedHookDetail) => void;
  /**
   * Single funnel for every API error normalized below. Wired in
   * `app/bridge/wireAppHttpClient.ts` to `reportApiError`.
   */
  onApiError: (error: ApiError | Error) => void;
};

const defaultOptions: Options = {
  timeout: 15000,
  retry: {
    limit: 1,
    methods: ['get'],
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
};

/** Configured API transport. Auth is wired in `app/bridge/wireAppHttpClient`. */
export function createApiTransport(prefix: string, auth: HttpAuthHooks) {
  const base = `${prefix.replace(/\/$/, '')}/`;
  return ky.create({
    ...defaultOptions,
    prefix: base,
    hooks: {
      beforeRequest: [
        ({ request }) => {
          request.headers.set('Accept', 'application/json');
          request.headers.set('Content-Type', 'application/json');
          const token = auth.getAccessToken();
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        },
      ],
      beforeError: [
        async state => {
          if (!(state.error instanceof HTTPError)) {
            auth.onApiError(state.error);
            return state.error;
          }

          let payload: ApiErrorPayload | undefined;
          try {
            payload = (await state.error.response.clone().json()) as ApiErrorPayload;
          } catch {
            payload = undefined;
          }

          if (state.error.response.status === 401) {
            auth.onUnauthorized({
              kyContext: state.options.context ?? {},
            });
          }

          const message =
            payload?.message ?? `Request failed with status ${state.error.response.status}`;
          const apiError = new ApiError(message, state.error.response.status, payload);
          auth.onApiError(apiError);
          return apiError;
        },
      ],
    },
  });
}

export function createAppHttpClient(hooks: HttpAuthHooks) {
  return createApiTransport(resolveApiBaseUrl(), hooks);
}

export { HTTPError };
