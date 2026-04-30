/** Laravel-style envelope pages field — donation responses include it on web types. */
export type DonationPaginationDto = {
  current_page?: number;
  per_page?: number;
  total?: number;
  next?: string | null;
};

export interface CreateDonationIrBodyTypes {
  email: string;
  full_name: string;
  price: string;
  message?: string;
  gateway_name: string;
}

export interface CreateDonationComBodyTypes extends CreateDonationIrBodyTypes {
  payment_method: string;
  first_name?: string;
  last_name?: string;
  card_number?: string;
  type?: string;
  expiry_month?: string;
  expiry_year?: string;
  cvv?: string;
}

export type PublicDonationDto = {
  donate_id: number;
  donate_payment_id: number;
  url: string | null;
};

export type PublicDonationResponse = {
  message: string;
  data: PublicDonationDto;
  pagination?: DonationPaginationDto;
};
