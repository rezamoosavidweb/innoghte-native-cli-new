import { fetchFaqFake } from '@/features/faqs/data/seedFaqs';

export { type FaqType } from '@/features/faqs/data/seedFaqs';

export async function fetchFaqs() {
  return fetchFaqFake();
}
