import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';

export async function deactivateUserDevice(deviceId: number): Promise<void> {
  await getApiClient().get(endpoints.auth.userDeviceDeactivate(deviceId));
}
