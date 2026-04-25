import { semantic } from '@/shared/styles/theme/core/semantic';

export function pickSemantic(isDark: boolean) {
  return isDark ? semantic.dark : semantic.light;
}
