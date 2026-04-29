/** i18n key for account active / inactive line (avoids ternaries in JSX). */
export function getAccountStatusMessageKey(isActive: boolean) {
  return isActive
    ? ('screens.profile.accountActive' as const)
    : ('screens.profile.accountInactive' as const);
}

/** i18n key for error-state retry control label. */
export function getRetryLabelKey(isFetching: boolean) {
  return isFetching
    ? ('screens.profile.loading' as const)
    : ('screens.profile.retry' as const);
}
