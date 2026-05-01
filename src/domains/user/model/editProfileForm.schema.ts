import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const MAX_SIZE_MB = 3;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif'] as const;

export const pickedAvatarFileSchema = z
  .object({
    uri: z.string(),
    type: z.string(),
    name: z.string(),
    fileSize: z.number().optional(),
  })
  .refine(
    f => f.fileSize == null || f.fileSize <= MAX_SIZE_MB * 1024 * 1024,
    { message: `File size must not exceed ${MAX_SIZE_MB}MB.` },
  )
  .refine(
    f =>
      ACCEPTED_TYPES.includes(f.type as (typeof ACCEPTED_TYPES)[number]),
    {
      message: `File must be one of ${ACCEPTED_TYPES.join(', ')}.`,
    },
  );

const avatarFieldSchema = z.union([pickedAvatarFileSchema, z.string()]);

export const editProfileFormSchema = z.object({
  avatar: avatarFieldSchema,
  full_name: z.string().min(1, 'این فیلد الزامی است.'),
  email: z
    .string()
    .min(1, 'این فیلد الزامی است.')
    .email('ایمیل معتبر نیست.'),
  mobile: z.object({
    dial: z.string().min(1, { message: 'این فیلد الزامی است.' }),
    countryCode: z.string(),
    dialCode: z.string(),
  }),
});

export const editProfileFormResolver = zodResolver(editProfileFormSchema);
export type EditProfileFormType = z.infer<typeof editProfileFormSchema>;
