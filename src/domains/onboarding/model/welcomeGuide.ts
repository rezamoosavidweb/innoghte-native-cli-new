import { StorageService } from '@/shared/infra/storage/storage.service';

export const WELCOME_GUIDE_STORAGE_KEY = 'welcome-guide-completed-version';
const GUIDE_VERSION = '1';

export const WELCOME_SLIDES = [
  'welcome',
  'courses',
  'albums',
  'live',
  'profile',
] as const;

export type WelcomeSlide = (typeof WELCOME_SLIDES)[number];

export function hasCompletedWelcomeGuide(): boolean {
  return StorageService.getString(WELCOME_GUIDE_STORAGE_KEY) === GUIDE_VERSION;
}

export function completeWelcomeGuide(): void {
  StorageService.setString(WELCOME_GUIDE_STORAGE_KEY, GUIDE_VERSION);
}

/** The carousel uses physical LTR offsets; Persian pages advance to the right. */
export function guidePageIndex(index: number, isRTL: boolean): number {
  return isRTL ? WELCOME_SLIDES.length - 1 - index : index;
}
