import { AuthService } from '@/domains/auth';
import { handleKy401Unauthorized } from '@/shared/infra/auth401';
import { initAppHttpClient, reportApiError } from '@/shared/infra/http';

// Optional: make redirect-on-401 the default for requests without per-call `context.auth401`.
// import { setGlobalAuth401Defaults } from '@/shared/infra/auth401';
// setGlobalAuth401Defaults({ strategy: 'back_to_previous_screen', redirectToLogin: true });

initAppHttpClient({
  getAccessToken: () => AuthService.getToken(),
  onUnauthorized: handleKy401Unauthorized,
  onApiError: reportApiError,
});
