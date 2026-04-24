import { fetchEventsFake } from '@/features/events/data/seedEvents';

export { type EventType } from '@/features/events/data/seedEvents';

export async function fetchEvents() {
  return fetchEventsFake();
}
