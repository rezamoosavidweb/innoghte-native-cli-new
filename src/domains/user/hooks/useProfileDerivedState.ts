import * as React from 'react';

import type { UserDto } from '@/domains/auth/model/apiTypes';
import {
  mapUserDtoToProfileHeaderUser,
  resolveProfileHeaderDisplayName,
  type ProfileHeaderUser,
} from '@/domains/user/model/profileHeaderUser';
import { initialsFromDisplayName } from '@/shared/utils/initialsFromDisplayName';
import { resolveAvatarUri } from '@/shared/utils/resolveAvatarUri';

export type ProfileDerivedState = {
  profileUser: ProfileHeaderUser | null;
  displayName: string;
  initials: string;
  avatarUri: string | null;
};

export function useProfileDerivedState(
  user: UserDto | undefined,
  fallbackDisplayName: string,
): ProfileDerivedState {
  return React.useMemo(() => {
    if (!user) {
      return {
        profileUser: null,
        displayName: fallbackDisplayName,
        initials: initialsFromDisplayName(fallbackDisplayName),
        avatarUri: resolveAvatarUri(undefined),
      };
    }

    const profileUser = mapUserDtoToProfileHeaderUser(user);
    const displayName = resolveProfileHeaderDisplayName(profileUser);

    return {
      profileUser,
      displayName,
      initials: initialsFromDisplayName(displayName),
      avatarUri: resolveAvatarUri(user.avatar),
    };
  }, [user, fallbackDisplayName]);
}
