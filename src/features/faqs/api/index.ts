import type { FaqType } from '@/features/faqs/types';
import { getFaqs } from '@/shared/api/modules/content.service';

export { type FaqType } from '@/features/faqs/types';

export async function fetchFaqs(): Promise<readonly FaqType[]> {
  return getFaqs();
}
