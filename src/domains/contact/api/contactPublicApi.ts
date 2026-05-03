import { z } from 'zod';

import { getApiClient } from '@/shared/infra/http/appHttpClient';
import { endpoints } from '@/shared/infra/http/endpoints';
import { parseJsonResponse } from '@/shared/infra/http/parseJson';

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  is_active: z.union([z.boolean(), z.null()]).optional(),
  created_at: z.string().optional(),
});

const listCategoriesEnvelope = z.object({
  data: z.array(categorySchema),
  message: z.string().optional(),
});

const genericEnvelope = z.object({
  data: z.unknown(),
  message: z.string().optional(),
});

export type ContactCategoryDto = z.infer<typeof categorySchema>;

export async function fetchContactUsCategories(): Promise<ContactCategoryDto[]> {
  const raw = await parseJsonResponse(
    getApiClient().get(endpoints.public.contactUsCategories),
    listCategoriesEnvelope,
  );
  return raw.data.filter(c => c.is_active !== false);
}

type SendOtpData = { is_valid?: boolean; ttl?: string };

export async function postContactUsSendOtp(input: {
  email: string;
  mobile: string;
}): Promise<{ isValid: boolean; ttl?: string }> {
  const raw = await parseJsonResponse(
    getApiClient().post(endpoints.public.contactUsSendOtp, {
      json: input,
    }),
    genericEnvelope,
  );
  const d = raw.data as SendOtpData;
  return { isValid: d.is_valid === true, ttl: d.ttl };
}

export async function postContactUsVerifyOtp(input: {
  otp: string;
  email: string;
}): Promise<boolean> {
  const raw = await parseJsonResponse(
    getApiClient().post(endpoints.public.contactUsVerifyOtp, {
      json: input,
    }),
    genericEnvelope,
  );
  const d = raw.data as { is_valid?: boolean };
  return d.is_valid === true;
}

type CreateData = { status?: number };

export async function postContactUsCreate(input: {
  full_name: string;
  email: string;
  mobile: string;
  title: string;
  info: string;
  category_id: string;
}): Promise<number> {
  const raw = await parseJsonResponse(
    getApiClient().post(endpoints.public.contactUsCreate, {
      json: input,
    }),
    genericEnvelope,
  );
  const d = raw.data as CreateData;
  return typeof d.status === 'number' ? d.status : 1;
}
