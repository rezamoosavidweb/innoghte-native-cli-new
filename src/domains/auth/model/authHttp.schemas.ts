import { z } from 'zod';

const tokenDataSchema = z
  .object({
    access_token: z.string(),
    expiration: z.string(),
    token_type: z.literal('Bearer'),
  })
  .passthrough();

export const loginResponseSchema = z.object({
  data: tokenDataSchema,
  message: z.string(),
});

export const registerResponseSchema = z.object({
  data: tokenDataSchema,
  message: z.string(),
});

export const userResponseSchema = z
  .object({
    data: z
      .object({
        id: z.number(),
        name: z.string(),
        family: z.string(),
        full_name: z.string(),
        email: z.string(),
        mobile: z.string(),
        avatar: z.string(),
        is_active: z.boolean(),
        last_login: z.string(),
        email_verified_at: z.union([z.string(), z.null()]).optional(),
        mobile_verified_at: z.union([z.string(), z.null()]).optional(),
        created_at: z.string(),
        updated_at: z.string(),
      })
      .passthrough(),
    message: z.string(),
    pagination: z.array(z.unknown()).optional(),
  })
  .passthrough();
