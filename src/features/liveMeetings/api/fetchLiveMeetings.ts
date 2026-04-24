import { fetchLiveMeetingFake } from '../data/seedLiveMeetings';

export { type LiveMeetingType } from '../data/seedLiveMeetings';

export async function fetchLiveMeetings() {
  return fetchLiveMeetingFake();
}
