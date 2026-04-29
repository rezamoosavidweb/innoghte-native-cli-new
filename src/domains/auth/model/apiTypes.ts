export type LoginBodyType = {
  password: string;
  email?: string;
  mobile?: string;
  type: 'mobile' | 'email';
  remember?: number;
};

export type LoginDto = {
  access_token: string;
  expiration: number;
  token_type: 'Bearer';
};

export type RegisterBodyType = {
  mobile: string;
  country_code: string;
  name: string;
  family: string;
  email: string;
  password: string;
  ref_code: string;
};
export type RegisterDto = {
  access_token: string;
  expiration: string;
  token_type: 'Bearer';
};
export type UserDto = {
  id: number;
  name: string;
  family: string;
  full_name: string;
  email: string;
  mobile: string;
  avatar: string;
  is_active: boolean;
  last_login: string;
  /** May be omitted or null when email is not verified. */
  email_verified_at?: string | null;
  /** May be omitted or null when mobile is not verified. */
  mobile_verified_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type UserResponseType = {
  data: UserDto;
  message: string;
};

export type RegisterResponse = {
  data: RegisterDto;
  message: string;
};

export type LoginResponse = {
  data: RegisterDto;
  message: string;
};

export type ForgetPasswordResponse = {
  data: [];
  message: string;
};
export type ResetPasswordBodyType = {
  token: string;
  email: string;
  new_password: string;
  new_password_confirm: string;
};
export type ResetPasswordResponse = {
  data: [];
  message: string;
};
export interface CheckotpBodyType {
  otp: string;
  email_identifier: string;
  mobile_identifier: string;
}
export type ResendVerifyOtpBodyType = {
  type: 'both' | 'mobile' | 'email';
  email?: string;
  mobile?: string;
};
