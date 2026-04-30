import { z } from 'zod';

import { resolveIsDotIr } from '@/shared/config/resolveIsDotIr';
import { ApiError, parseJsonResponse } from '@/shared/infra/http';
import { getApiClient } from '@/shared/infra/http/appHttpClient';

const CREATE_PRESENT_PATH = 'api/presents/create';

const PUBLIC_CART_CREATE_PATH = 'api/v1/public/carts/create';

const PUBLIC_CART_DELETE_TOKEN_PATH =
  'api/v1/public/carts/delete/cart-token';

export const givePresentCreatedSchema = z
  .object({
    status: z.number(),
    message: z.string(),
    present: z
      .object({
        id: z.number(),
      })
      .passthrough(),
  })
  .passthrough();

export type GivePresentCreated = z.infer<typeof givePresentCreatedSchema>;

const cartCreateEnvelopeSchema = z
  .object({
    message: z.string(),
    data: z.unknown().optional(),
  })
  .passthrough();

function scopeHeader(): { Scope: 'ir' | 'com' } {
  return { Scope: resolveIsDotIr() ? 'ir' : 'com' };
}

export async function postCreateGivePresent(
  body: {
    receiver_first_name: string;
    receiver_last_name: string;
    receiver_email: string;
    receiver_mobile: string;
    message?: string;
    course_ids: number[];
  },
): Promise<GivePresentCreated> {
  return parseJsonResponse(
    getApiClient().post(CREATE_PRESENT_PATH, {
      json: body,
      headers: scopeHeader(),
    }),
    givePresentCreatedSchema,
  );
}

/** Clears anonymous cart tied to {@link X-Cart-Token} (same semantics as web). */
export async function deleteAllAnonymousCartItems(cartToken: string): Promise<void> {
  const response = await getApiClient().delete(PUBLIC_CART_DELETE_TOKEN_PATH, {
    headers: {
      ...scopeHeader(),
      'X-Cart-Token': cartToken,
    },
  });
  await response.text().catch(() => '');
}

/** Adds one line item to anonymous cart — matches web `postPublicCartCreate`. */
export async function postAnonymousCartCreate(params: {
  cartToken: string;
  courseId: number;
}): Promise<void> {
  await parseJsonResponse(
    getApiClient().post(PUBLIC_CART_CREATE_PATH, {
      headers: {
        ...scopeHeader(),
        'X-Cart-Token': params.cartToken,
      },
      json: { course_id: params.courseId },
    }),
    cartCreateEnvelopeSchema,
  );
}

type PresentErrorEnvelope = {
  status?: unknown;
  data?: {
    ir?: Record<string, unknown>;
    com?: Record<string, unknown>;
  };
};

export function mergePurchasedTitlesFromLegacyPresentError(
  rawPayload: ApiError['payload'],
  isDotIr: boolean,
): string[] {
  if (!rawPayload || typeof rawPayload !== 'object') {
    return [];
  }
  const p = rawPayload as PresentErrorEnvelope;
  if (Number(p.status) !== 0) {
    return [];
  }
  const merged: Record<string, unknown> =
    isDotIr && typeof p.data === 'object' && p.data
      ? { ...p.data.ir, ...p.data.com }
      : { ...(typeof p.data === 'object' && p.data ? p.data.com : {}) };

  return Object.values(merged ?? {}).filter(
    (val): val is string => typeof val === 'string' && Boolean(val.trim()),
  );
}

export function purchasedCoursesMessageFromTitles(titles: string[]): string {
  const courses = [...titles];
  if (courses.length > 1) {
    return `دوره‌های "${courses.join('", "')}" را فرد هدیه گیرنده دارد.`;
  }
  if (courses.length === 1) {
    return `دوره‌ی "${courses[0]}" را فرد هدیه گیرنده دارد.`;
  }
  return '';
}

export function looksLikeLegacyPurchasedCoursesErrorPayload(
  err: unknown,
): boolean {
  if (!(err instanceof ApiError)) return false;
  const body = err.payload as PresentErrorEnvelope | undefined;
  return Number(body?.status) === 0 && body?.data != null;
}
