import { semantic } from '@/ui/theme/core/semantic';

export function pickSemantic(isDark: boolean) {
  return isDark ? semantic.dark : semantic.light;
}
