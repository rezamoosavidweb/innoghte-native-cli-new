import {
  mapLiveMeetingItem,
  type LiveMeetingType,
} from '@/features/liveMeetings/types';
import { getLiveMeetings } from '@/shared/api/modules/content.service';

export { type LiveMeetingType } from '@/features/liveMeetings/types';

export async function fetchLiveMeetings(): Promise<readonly LiveMeetingType[]> {
  const items = await getLiveMeetings();
  return items.map(mapLiveMeetingItem);
}
