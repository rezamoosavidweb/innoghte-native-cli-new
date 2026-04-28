import { AuthService } from '@/domains/auth';
import { initAppHttpClient, reportApiError } from '@/shared/infra/http';

initAppHttpClient({
  getAccessToken: () => AuthService.getToken(),
  onUnauthorized: () => AuthService.clearLocalAuth(),
  onApiError: reportApiError,
});
