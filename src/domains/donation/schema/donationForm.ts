import isCreditCard from '@/domains/donation/utils/paymentFormatting';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FieldErrors } from 'react-hook-form';
import { z } from 'zod';

const userInfoValidationSchema = z.object({
  fullName: z
    .string({ message: 'این فیلد الزامی است.' })
    .min(1, 'لطفا نام و نام خانوادگی خود را وارد نمایید.'),
  email: z
    .string({ message: 'این فیلد الزامی است.' })
    .min(1, 'لطفا ایمیل خود را وارد نمایید.'),
  comment: z.string().optional(),
});

const creditCardValidationSchema = z.object({
  fistName: z.string({ message: 'این فیلد الزامی است.' }).min(2, 'حداقل ۳ کاراکتر'),
  lastName: z.string({ message: 'این فیلد الزامی است.' }).min(2, 'حداقل ۶ کاراکتر'),
  cardType: z.string({ message: 'این فیلد الزامی است.' }),
  cardNumber: z
    .string({ message: 'این فیلد الزامی است.' })
    .refine(isCreditCard, { message: 'شماره کارت را به درستی وارد کنید' }),
  expireMonth: z
    .string({ message: 'این فیلد الزامی است.' })
    .min(2, { message: 'ماه را به درستی وارد کنید' }),
  expireYear: z
    .string({ message: 'این فیلد الزامی است.' })
    .min(4, { message: 'سال را به درستی وارد کنید' }),
  cvv: z
    .string({ message: 'این فیلد الزامی است.' })
    .min(3, { message: 'CVV را به درستی  وارد کنید' })
    .max(4)
    .regex(/^[0-9]+$/, { message: 'CVV را به درستی  وارد کنید' }),
});

const donationValidation = z.discriminatedUnion('paymentType', [
  z.object({
    paymentType: z.literal('credit_card'),
    cart: creditCardValidationSchema,
    user: userInfoValidationSchema,
  }),
  z.object({
    paymentType: z.literal('paypal'),
    user: userInfoValidationSchema,
  }),
]);

export const donationFormResolver = zodResolver(donationValidation);
export type DonationFormType = z.infer<typeof donationValidation>;
export type DonationCreditCartType = z.infer<typeof creditCardValidationSchema>;
export type DonationCreditCartErrors = FieldErrors<{
  cart: Omit<DonationCreditCartType, 'cardNumber'> & { cardNumber: string };
}>;

export const donationCartOptions = [
  { value: '1', label: 'Visa' },
  { value: '2', label: 'Mastercard' },
  { value: '3', label: 'Amex' },
  { value: '4', label: 'Discover' },
  { value: '5', label: 'JCB' },
  { value: '6', label: 'Diners' },
] as const;
