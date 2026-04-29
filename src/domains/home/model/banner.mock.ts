import type { BannerItemData } from '@/domains/home/ui/Banner';

/**
 * Static demo data for the Home > Banner hero — layered like legacy web
 * `ParBanner`: gradient background + Lamp + typography + Par artwork.
 */
export const HOME_BANNER_MOCK: ReadonlyArray<
  Omit<BannerItemData, 'onPress' | 'cta'>
> = [
  {
    id: 'par-banner',
    image: require('@/assets/images/new-banner/web-back.jpg'),
    lampImage: require('@/assets/images/new-banner/Lamp.png'),
    parImage: require('@/assets/images/new-banner/Par.png'),
    titleLine1Accent: {
      before: 'ره ',
      highlight: 'آسمان',
      after: ' درون است',
    },
    titleRest: 'پر عشق را بجنبان',
    subtitle: 'پر عشق چون قوی شد\nغم نردبان نماند…',
  },
];
