# Design system (`src/theme`)

This directory holds **only** the design system and the app theme **provider**. Screen- and component-level `StyleSheet` hooks live next to UI:

- `src/components/themed/*.styles.ts` — shared card / row styles used by features.
- `src/screens/themed/*.styles.ts` — screen-specific style hooks.

Import the public API from **`src/theme`** (barrel `index.ts`).

## Layout

```
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
} from '../theme';
```

Prefer **`colors`** (primitives) for raw ramps; **`semantic`** / **`useTheme().colors`** for UI. `designTokens` includes **`palette`** as an alias of **`colors`** for older snippets.

### Screen / component styles

```tsx
import { useFaqsScreenLayoutStyles } from '../screens/themed/faqsScreen.styles';
import { useProductListCardStyles } from '../components/themed/ProductListCard.styles';
```

### Provider

```tsx
import { AppThemeProvider, useAppTheme } from '../theme';
```

## Rules

- Do **not** add new `*Themed.ts` files under `theme/` — add `*.styles.ts` under `components/themed` or `screens/themed`.
- Keep **`theme/`** free of feature or screen business logic.
- Avoid shadowing `useTheme().colors` with `import { colors }`; use `import { colors as colorPrimitives }` when you need both.

## Performance

- `designTokens` is a constant reference.
- `AppThemeProvider` memoizes context value so consumers only re-render when the resolved color scheme changes.
