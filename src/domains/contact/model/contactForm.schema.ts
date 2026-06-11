import { z } from 'zod';

// Mirrors the web ContactForm `mobile` shape so the shared PhoneInput drives it
// (web: `react-phone-input-2` → { dial, countryCode, dialCode }).
const mobile = z
  .object({
    dial: z.string().min(1, 'این فیلد الزامی است.'),
    countryCode: z.string(),
    dialCode: z.string(),
  })
  .required({ dial: true });

export const contactFormSchema = z.object({
  full_name: z.string().min(1, 'این فیلد الزامی است.'),
  email: z.string().min(1, 'این فیلد الزامی است.').email('ایمیل معتبر نیست.'),
  mobile,
  title: z.string().min(1, 'این فیلد الزامی است.'),
  category_id: z.string().min(1, 'انتخاب دسته‌بندی الزامی است.'),
  info: z
    .string()
    .min(1, 'این فیلد الزامی است.')
    .max(200, 'حداکثر 200 کاراکتر'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
