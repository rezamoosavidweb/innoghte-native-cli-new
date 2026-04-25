import { mapEventItem, type EventType } from '@/features/events/types';
import { getEvents } from '@/shared/api/modules/content.service';

export { type EventType } from '@/features/events/types';

export async function fetchEvents(): Promise<readonly EventType[]> {
  const items = await getEvents();
  return items.map(mapEventItem);
}
