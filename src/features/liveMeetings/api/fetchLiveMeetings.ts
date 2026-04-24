import { fetchLiveMeetingFake } from '@/features/liveMeetings/data/seedLiveMeetings';

export { type LiveMeetingType } from '@/features/liveMeetings/data/seedLiveMeetings';

export async function fetchLiveMeetings() {
  return fetchLiveMeetingFake();
}
