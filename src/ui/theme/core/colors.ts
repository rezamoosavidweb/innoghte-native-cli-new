/**
 * @deprecated Re-exports the primitive palette from `@/ui/theme/colors`.
 *
 * Kept so the legacy import path (`@/ui/theme/core/colors`) continues to
 * work during the migration. New code should import from `@/ui/theme`
 * (semantic via `useAppTheme().theme.colors`) and only fall back to the raw
 * `palette` when a specific UX requires a primitive ramp.
 */
export {
  colors,
  palette,
  type Colors,
  type Palette,
} from '@/ui/theme/colors';
