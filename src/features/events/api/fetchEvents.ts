import { fetchEventsFake } from '../data/seedEvents';

export { type EventType } from '../data/seedEvents';

export async function fetchEvents() {
  return fetchEventsFake();
}
