import { fetchFaqFake } from '../data/seedFaqs';

export { type FaqType } from '../data/seedFaqs';

export async function fetchFaqs() {
  return fetchFaqFake();
}
