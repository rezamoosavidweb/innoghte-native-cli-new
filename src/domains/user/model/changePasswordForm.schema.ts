import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const passwordField = (emptyMessage: string) =>
  z
    .string()
    .min(1, emptyMessage)
    .min(6, 'حداقل ۶ کاراکتر')
    .max(50, 'حداکثر ۵۰ کاراکتر')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
      'رمز باید شامل حروف انگلیسی و عدد باشد.',
    );

export const changePasswordFormSchema = z
  .object({
    old: passwordField('رمز عبور فعلی الزامی است'),
    new: passwordField('رمز عبور جدید الزامی است'),
    confirm: passwordField('تکرار رمز عبور الزامی است'),
  })
  .superRefine((data, ctx) => {
    if (data.new !== data.confirm) {
      ctx.addIssue({
        code: 'custom',
        message: 'پسورد وتکرار آن برابر نیست',
        path: ['confirm'],
      });
    }
  });

export const changePasswordFormResolver = zodResolver(
  changePasswordFormSchema,
);
export type ChangePasswordFormType = z.infer<typeof changePasswordFormSchema>;
