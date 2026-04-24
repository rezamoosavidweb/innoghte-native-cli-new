import { semantic } from '@/theme/core/semantic';

export function pickSemantic(isDark: boolean) {
  return isDark ? semantic.dark : semantic.light;
}
