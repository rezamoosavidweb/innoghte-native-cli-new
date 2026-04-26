import {
  createAppHttpClient,
  type HttpAuthHooks,
} from '@/shared/infra/http/createHttpClient';

type AppClient = ReturnType<typeof createAppHttpClient>;

let client: AppClient | null = null;

export function initAppHttpClient(auth: HttpAuthHooks): void {
  client = createAppHttpClient(auth);
}

export function getApiClient(): AppClient {
  if (!client) {
    throw new Error(
      'HTTP client not initialized. Ensure app/bridge/wireAppHttpClient runs before any API call.',
    );
  }
  return client;
}
