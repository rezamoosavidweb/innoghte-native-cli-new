import type { UserDto } from '@/domains/auth/model/apiTypes';

/** Profile header view model — strongly typed fields for UI (maps from {@link UserDto}). */
export type ProfileHeaderUser = {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  isEmailVerified: boolean;
  phone: string;
  isPhoneVerified: boolean;
};

export function mapUserDtoToProfileHeaderUser(user: UserDto): ProfileHeaderUser {
  const firstName = user.name?.trim() ?? '';
  const lastName = user.family?.trim() ?? '';
  const combined = [firstName, lastName].filter(Boolean).join(' ').trim();
  const fullName = user.full_name?.trim() || combined;

  return {
    firstName,
    lastName,
    fullName,
    email: user.email?.trim() ?? '',
    isEmailVerified: Boolean(user.email_verified_at),
    phone: user.mobile?.trim() ?? '',
    isPhoneVerified: Boolean(user.mobile_verified_at),
  };
}

export function resolveProfileHeaderDisplayName(u: ProfileHeaderUser): string {
  const fromParts = [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
  return fromParts || u.fullName;
}
