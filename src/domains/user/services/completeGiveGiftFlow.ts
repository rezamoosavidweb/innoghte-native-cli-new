import {
  deleteAllAnonymousCartItems,
  postAnonymousCartCreate,
  postCreateGivePresent,
} from '@/domains/user/api/giveGiftApi';
import { PRESENT_STORAGE_JSON_KEY } from '@/domains/user/model/giveGift.storageKeys';
import { readOrCreateCartToken } from '@/domains/user/model/giveGiftCartToken';
import { StorageService } from '@/shared/infra/storage/storage.service';

export type GivePresentRequestBody = {
  receiver_first_name: string;
  receiver_last_name: string;
  receiver_email: string;
  receiver_mobile: string;
  message?: string;
  course_ids: number[];
};

/**
 * Ordered side-effects after validated give-gift: create present, persist mapping, sync anonymous cart.
 * Pure async orchestration (no React).
 */
export async function completeGiveGiftFlow(
  body: GivePresentRequestBody,
  selectedProducts: number[],
): Promise<void> {
  const res = await postCreateGivePresent(body);

  StorageService.set(PRESENT_STORAGE_JSON_KEY, {
    [`${res.present.id}`]: body.course_ids,
  });

  const cartToken = readOrCreateCartToken();
  await deleteAllAnonymousCartItems(cartToken);
  await Promise.all(
    selectedProducts.map(productId =>
      postAnonymousCartCreate({ cartToken, courseId: productId }),
    ),
  );
}
