import type { VerifyChannel, VerifyStep } from '@/shared/contracts/verification';
import { isEmailChannel } from '@/shared/contracts/verification';

/** i18n keys — resolved with `t()` in the screen. */
export function getVerifyTitleKey(step: VerifyStep, channel: VerifyChannel) {
  if (step === 'INPUT') {
    return isEmailChannel(channel)
      ? ('screens.verify.inputTitleEmail' as const)
      : ('screens.verify.inputTitleMobile' as const);
  }
  return 'screens.verify.codeTitle' as const;
}

export function getVerifySubtitleKey(step: VerifyStep, channel: VerifyChannel) {
  if (step === 'INPUT') {
    return isEmailChannel(channel)
      ? ('screens.verify.inputSubtitleEmail' as const)
      : ('screens.verify.inputSubtitleMobile' as const);
  }
  return 'screens.verify.codeSubtitle' as const;
}

export function getVerifyContactLabelKey(channel: VerifyChannel) {
  return isEmailChannel(channel)
    ? ('screens.verify.emailLabel' as const)
    : ('screens.verify.mobileLabel' as const);
}

export function getVerifyContactPlaceholderKey(channel: VerifyChannel) {
  return isEmailChannel(channel)
    ? ('screens.verify.emailPlaceholder' as const)
    : ('screens.verify.mobilePlaceholder' as const);
}
