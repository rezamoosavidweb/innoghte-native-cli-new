# Design system (`src/ui/theme`)

This directory holds **only** the design system and the app theme **provider**. Screen- and component-level `StyleSheet` hooks are co-located with the code that uses them:

- `src/domains/<domain>/ui/*.styles.ts` — domain-scoped screen and component style hooks.
- `src/shared/ui/**/*.styles.ts` — shared cross-domain component styles (e.g. `productListCard.styles.ts`).
- `src/ui/theme/formField.styles.ts` — global form-field styles (exception: lives in theme because it's consumed by `ui/` components).

Import the public API from **`@/ui/theme`** (barrel `index.ts`).

## Layout

```text
theme/
  index.ts                 # public exports
  core/
    colors.ts              # primitive scales (hex)
    palette.ts             # re-exports `colors` as `palette` (legacy name)
    semantic.ts            # light/dark UI roles (maps colors → meaning)
    designTokens.ts        # stable bundle for `useAppTheme().tokens`
    spacing.ts
    typography.ts
    radius.ts
    shadows.ts
    navigationTheme.ts     # React Navigation themes
    navigationChrome.ts    # drawer / tab bar chrome StyleSheets
    navScreenLayout.ts     # FlashList gutters + shell / scaffold hooks
  utils/
    colorUtils.ts          # e.g. hexAlpha()
    pickSemantic.ts        # theme.dark → semantic slice
  provider/
    AppThemeProvider.tsx
```

## Usage

### Tokens & navigation

```tsx
import {
  spacing,
  pickSemantic,
  useNavScreenShellStyles,
  navigationThemes,
} from '@/ui/theme';
```

Prefer **`colors`** (primitives) for raw ramps; **`semantic`** / **`useTheme().colors`** for UI. `designTokens` includes **`palette`** as an alias of **`colors`** for older snippets.

### Screen / component styles

Style hooks are co-located with their component or screen, not inside `theme/`. Each accepts `colors` from `useTheme()` and returns a `StyleSheet.create(...)` object:

```tsx
// src/domains/support/faqs/ui/faqsScreen.styles.ts
export function useFaqsScreenStyles(colors: ThemeColors) {
  return StyleSheet.create({ ... });
}

// In the screen:
const { colors } = useTheme();
const s = useFaqsScreenStyles(colors);
```

### Provider

```tsx
import { AppThemeProvider, useAppTheme, useThemeColors } from '@/ui/theme';
```

## Rules

- Keep **`theme/`** free of feature or screen business logic — no domain imports, no screen-specific styles.
- Add new `*.styles.ts` files co-located with the component or screen they style (inside the domain's `ui/` folder or `shared/ui/`), not inside `theme/`.
- Avoid shadowing `useTheme().colors` with `import { colors }`; use `import { colors as colorPrimitives }` when you need both.

## Performance

- `designTokens` is a constant reference.
- `AppThemeProvider` memoizes context value so consumers only re-render when the resolved color scheme changes.
