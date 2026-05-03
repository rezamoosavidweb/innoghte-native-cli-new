import { z } from 'zod';

export const collaborationFormSchema = z.object({
  name: z.string().min(1, 'لطفا نام خود را وارد کنید.'),
  family: z.string().min(1, 'لطفا نام خانوادگی را وارد کنید.'),
  email: z.string().email('ایمیل معتبر وارد کنید.'),
  mobile: z
    .string()
    .min(1, 'لطفا شماره موبایل خود را وارد کنید.')
    .refine(
      value => value.replace(/\D/g, '').length >= 10,
      'شماره موبایل معتبر نیست.',
    ),
  birth_date: z
    .string()
    .min(1, 'لطفا سال تولد را وارد کنید.')
    .regex(/^\d{4}$/, 'سال تولد باید عددی ۴ رقمی باشد.'),
  gender: z.string().min(1, 'انتخاب این فیلد ضروری است.'),
  marital_status: z.string().min(1, 'انتخاب این فیلد ضروری است.'),
  experience: z.string().min(1, 'انتخاب این فیلد ضروری است.'),
  work_with_us_category_id: z.string().min(1, 'انتخاب این فیلد ضروری است.'),
  city: z.string().min(1, 'لطفا شهر را وارد کنید.'),
  address: z.string().min(1, 'لطفا آدرس خود را وارد کنید.'),
  description: z.string().min(1, 'لطفا توضیحات خود را وارد کنید.'),
});

export type CollaborationFormValues = z.infer<typeof collaborationFormSchema>;

export const collaborationResumeSchema = z
  .object({
    uri: z.string(),
    name: z.string(),
    type: z.string(),
    size: z.number(),
  })
  .refine(r => r.size <= 2 * 1024 * 1024, 'حجم فایل نباید بیشتر از ۲ مگابایت باشد.');

export type CollaborationResumeValue = z.infer<typeof collaborationResumeSchema>;
