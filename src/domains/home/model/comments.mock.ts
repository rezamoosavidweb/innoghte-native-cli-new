import type { CommentItem } from '@/shared/ui/CommentCarousel';

/**
 * Static demo data for the Home > Comments section.
 * Replace with a real `useComments()` query when the API is wired up.
 */
export const HOME_COMMENTS_MOCK: ReadonlyArray<CommentItem> = [
  {
    user: 'Said Joudaki',
    createdAt: '07 Jan 2026',
    courseTitle: 'شروع بیداری',
    content:
      'این دوره واقعاً نگاه من به زندگی را عوض کرد. تمرین‌ها ساده ولی عمیق بودند و هر جلسه‌ای که جلوتر رفتم، آرامش بیشتری پیدا کردم. به همه پیشنهاد می‌کنم.',
  },
  {
    user: 'مریم احمدی',
    createdAt: '02 Jan 2026',
    courseTitle: 'مدیتیشن صبحگاهی',
    content:
      'مدت‌ها بود دنبال یک برنامه‌ی منظم برای صبح‌هایم می‌گشتم. این دوره دقیقاً همان چیزی بود که نیاز داشتم؛ کوتاه، اثرگذار و قابل اجرا.',
  },
  {
    user: 'علی رضایی',
    createdAt: '24 Dec 2025',
    courseTitle: 'تمرکز و بهره‌وری',
    content:
      'محتوای دوره خیلی منظم و کاربردی بود. تمرین‌های هفتگی کمک کرد عادت‌هایم را اصلاح کنم و در کارم تمرکز خیلی بهتری داشته باشم.',
  },
  {
    user: 'Anonymous',
    createdAt: '15 Dec 2025',
    courseTitle: 'هنر گوش دادن',
    content:
      'هیچ‌وقت فکر نمی‌کردم گوش دادن این‌قدر می‌تونه روی روابطم تأثیر بذاره. مدرس با حوصله و دقیق توضیح می‌داد و مثال‌های واقعی خیلی کمک کرد.',
  },
  {
    user: 'Niloofar K.',
    createdAt: '03 Dec 2025',
    courseTitle: 'پادکست رهایی',
    content:
      'هر اپیزود مثل یک جلسه‌ی کوتاه با یک دوست دانا بود. شب‌ها قبل از خواب گوش می‌دادم و ذهنم سبک‌تر می‌شد.',
  },
];
