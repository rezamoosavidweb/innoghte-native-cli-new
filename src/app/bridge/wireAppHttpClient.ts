import { getAccessToken } from '@/domains/auth/api/auth.storage';
import { useAuthStore } from '@/domains/auth/model/auth.store';
import { initAppHttpClient } from '@/shared/infra/http';

initAppHttpClient({
  getAccessToken,
  onUnauthorized: () => useAuthStore.getState().logout(),
});
