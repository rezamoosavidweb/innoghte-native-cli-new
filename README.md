# Innoghte (React Native)

A production-oriented React Native application built with TypeScript, a scalable **feature-first** layout, a **token-based theme system**, and **drawer + bottom-tab navigation**. This document is the **single source of truth** for how the codebase is organized and how to extend it safely.

---

## 1. Project overview

### What is this app?

**Innoghte** is a client app (package name `Innoghte`) that presents educational / content experiences: courses, albums, FAQs, events, live meetings, public albums, and account-related flows. Data is currently backed by **seed modules** and **async fetch functions** that simulate latency; the architecture is ready to swap in real HTTP clients without reshuffling folders.

### Key features (high level)

- **Bottom tabs** for primary sections (home, courses, albums, FAQs, profile, etc.)
- **Side drawer** wrapping tabs for secondary destinations (settings, help, events, login, placeholders for legacy menu items)
- **Internationalization** (i18next + react-i18next), including RTL-aware helpers
- **Theming**: light/dark via React Navigation theme + semantic tokens; persisted UI preferences (Zustand + MMKV)
- **Lists**: `@shopify/flash-list` with shared layout tokens (`flashListEstimatedItemSize`, gutters, separators)
- **Server state**: TanStack React Query (`use*Query` hooks per feature)

### Tech stack

| Layer | Choice |
|--------|--------|
| Runtime | React Native **0.85.x**, React **19.x** |
| Language | **TypeScript** (strict paths via `@react-native/typescript-config`) |
| Navigation | `@react-navigation/native`, **drawer** + **bottom-tabs** |
| Lists | `@shopify/flash-list` |
| Global state | **Zustand** (`src/stores`) |
| Server cache | **TanStack Query v5** |
| Persistence | **react-native-mmkv** |
| i18n | **i18next**, **react-i18next** |
| Animation | **react-native-reanimated**, **react-native-worklets** |
| Tooling | Metro, Babel (`babel-plugin-module-resolver` → `@/` alias), Jest |

**Node:** `>= 22.11.0` (see `package.json` → `engines`).

---

## 2. Getting started

### Prerequisites

- [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment) (JDK, Android SDK / Xcode, CocoaPods where applicable)
- **Node.js 22.11+** and **npm** or **Yarn**
- For Android: an emulator or device with USB debugging (or use `yarn android` with a running AVD)

### Installation

From the project root (`innoghte-native-cli-new/`):

```sh
npm install
# or
yarn install
```

If your default npm registry cannot resolve packages, install from the public registry (example):

```sh
npm install --registry https://registry.npmjs.org/
```

### Running the project

**Start Metro** (keep this terminal open):

```sh
npm start
# or
yarn start
```

**Android** (separate terminal, from project root):

```sh
npm run android
# or
yarn android
```

**iOS** (macOS, after `cd ios && pod install` when native deps change):

```sh
npm run ios
# or
yarn ios
```

### Other scripts

| Script | Purpose |
|--------|---------|
| `npm run lint` | ESLint |
| `npm test` | Jest (includes native mocks for gesture handler / worklets; see `jest.config.js`, `jest.native-mocks.js`) |
| `npm run android:apk` / `android:bundle` | Release builds (Gradle) |

### Environment & configuration

- There is **no committed `.env` file** in this repo; add secrets or API base URLs via your chosen mechanism (e.g. `.env` + a loader, or build-time defines) **without** committing credentials.
- **Path alias:** all app code under `src/` should import with `@/…` (see `tsconfig.json`, `babel.config.js`, `jest.config.js`). Do not reintroduce deep `../../../` imports for `src` modules.

---

## 3. Project structure

### Repository layout (conceptual tree)

```
innoghte-native-cli-new/
├── App.tsx                 # Root: providers, static navigation shell
├── index.js                # App registration
├── android/                # Native Android project
├── ios/                    # Native iOS project
├── __tests__/              # Jest tests (e.g. App smoke test)
├── scripts/                # Tooling (e.g. one-off codemods)
├── jest.config.js
├── jest.native-mocks.js    # Jest: worklets + RNGH setup order
├── jest.setup.js           # Jest: MMKV mock, etc.
├── babel.config.js         # RN preset + module-resolver (@ → src)
├── tsconfig.json           # baseUrl + paths: @/* → src/*
├── metro.config.js         # Default RN Metro merge
└── src/
    ├── bootstrap/          # App boot helpers (e.g. language hydration)
    ├── components/         # App-wide reusable UI (not domain-specific)
    │   └── themed/         # Shared style hooks + StyleSheet factories for cards/rows
    ├── features/           # Domain vertical slices (albums, courses, …)
    ├── lib/                # Cross-cutting utilities (storage, formatting, …)
    ├── navigation/         # Navigators, types, tab bar, drawer/i18n wiring
    ├── screens/            # Route-level screens (thin orchestration)
    │   └── themed/         # Screen-specific style hooks (shell, FAQ layout, …)
    ├── state/              # Small shared constants used by navigation/UI (e.g. badge counts)
    ├── stores/             # Zustand stores (language, UI theme)
    ├── theme/              # Design tokens, semantic palette, nav chrome, providers
    ├── translations/       # i18n resources + i18n init
    └── utils/              # Generic helpers (e.g. RTL)
```

### What each major area is for

| Path | Role |
|------|------|
| **`src/theme/`** | **Design system**: primitives (`palette`, `spacing`, `radius`, typography), **semantic** colors for light/dark, navigation themes, layout tokens for lists/screens, `AppThemeProvider` / `useAppTheme`. Barrel export: `@/theme`. |
| **`src/components/`** | **Reusable UI** used across features: drawer chrome, screen scaffold, menu button. **Not** where business entities live. |
| **`src/components/themed/`** | **Shared presentation styles** for list cards / rows (e.g. `ProductListCard.styles.ts`). Co-located hooks like `useProductListCardStyles` keep large `StyleSheet`s out of feature files. |
| **`src/screens/`** | **One file per route screen** (or shared placeholder). Screens compose hooks + feature components + `ScreenScaffold` / `SafeAreaView` patterns. |
| **`src/screens/themed/`** | **Screen-only** style hooks (e.g. `useNavScreenShellStyles` consumers, FAQ screen layout). |
| **`src/navigation/`** | **Single place** for `rootNavigator` (drawer → tabs), `TabParamList` / `DrawerParamList`, tab bar icons, drawer layout (RTL side), i18n-derived screen options. |
| **`src/features/<name>/`** | **Vertical slice**: `api/` (fetchers), `hooks/` (React Query), `data/` (types + seeds), `components/` (domain UI), `constants/` (query keys). |
| **`src/lib/`** | **Non-UI services** and pure helpers: MMKV-backed storage, locale number formatting, etc. |
| **`src/stores/`** | **Global client state** (Zustand): language, light/dark/system theme. |
| **`src/state/`** | **Shared constants** that are not persisted “store” state (e.g. notification badge stub for tab icon). |
| **`src/translations/`** | **i18n** instance and JSON/TS resources. |
| **`src/bootstrap/`** | **Startup** concerns (e.g. reading persisted language before first render where applicable). |

There is **no** top-level `services/` folder: **API entrypoints live in `src/features/<feature>/api/`** and are consumed by **`hooks/use*Query.ts`**.

---

## 4. Architecture principles

### Separation of concerns

- **`screens/`** = routing + composition + loading/error/empty UI for that route. Avoid embedding 200+ line StyleSheets here.
- **`features/<x>/components/`** = domain-specific UI (e.g. `CourseListCard`).
- **`features/<x>/api/`** + **`hooks/`** = data loading; screens call hooks, not raw `fetch` scattered in UI files.
- **`theme/`** = visual language; screens and shared components consume tokens and semantic helpers (`pickSemantic`), not raw hex everywhere.

### Component vs screen

| Responsibility | Belongs in |
|----------------|------------|
| “What route is this?” header/safe area/list wiring | **Screen** |
| “How does a course row look?” | **Feature component** + **`components/themed`** styles if shared across domains |
| “How do we load courses?” | **`useCoursesQuery`** + **`fetchCourses`** |

### Theme-driven styling

- **Navigation chrome** (header, tab bar, drawer) uses **semantic** colors from `pickSemantic(theme.dark)` and exported style objects (`mainTabBarLabelStyle`, `drawerChrome`, …).
- **Cards and lists** use **spacing**, **radius**, **fontSize** / **fontWeight** from `@/theme` inside `StyleSheet.create` (often via `create*Styles` + `use*Styles` hooks).

### Reusability rules

- If two **features** need the same **card chrome**, use **`src/components/themed/`** — do not duplicate StyleSheets.
- If logic is reused but UI differs, extract a **hook** under the most appropriate `features/` module or `lib/`.

---

## 5. Styling & theme system

### Mental model

1. **Primitives** — `palette`, `spacing`, `radius`, `fontSize`, etc. (`src/theme/core/`).
2. **Semantic** — `semantic.light` / `semantic.dark` meaning (“headerBg”, “drawerActiveTint”, …).
3. **`pickSemantic(isDark)`** — one object for the current scheme in components.
4. **React Navigation `useTheme()`** — for `colors.card`, `colors.text`, etc. aligned with the active navigation theme.

### Example (semantic + spacing in a style hook)

```tsx
import { StyleSheet } from 'react-native';
import { pickSemantic, radius, spacing } from '@/theme';
import { useTheme } from '@react-navigation/native';

export function useExampleCardStyles() {
  const { colors, dark } = useTheme();
  const s = pickSemantic(dark);

  return React.useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: spacing.md,
          borderRadius: radius.lg,
          backgroundColor: colors.card,
          borderColor: s.chipBorder,
        },
        title: { color: colors.text },
        subtitle: { color: s.textSecondary },
      }),
    [colors.card, colors.text, dark, s.chipBorder, s.textSecondary],
  );
}
```

### Do & don’t

| Do | Don’t |
|----|--------|
| Import tokens from `@/theme` | Hardcode `#1a237e` / `16` / `8` for the same meaning everywhere |
| Use `pickSemantic` for role-based colors | Mix ad-hoc rgba strings for surfaces that already exist in semantic |
| Keep `StyleSheet.create` in `*.styles.ts` or stable `useMemo` | Huge inline style objects on every render |
| Use `flashListContentGutters` / `flashListEstimatedItemSize` from theme | Magic numbers duplicated per screen |

More detail: `src/theme/README.md`.

---

## 6. Performance best practices

### Lists (`FlashList`)

- Use **`FlashList`** for long lists (see `CoursesScreen`, `AlbumsScreen`, etc.).
- Set a realistic **`estimatedItemSize`** — the app uses shared constants such as `flashListEstimatedItemSize.course` from `@/theme` (`navScreenLayout`).
- Prefer **`contentContainerStyle={flashListContentGutters.standard}`** (or the variant that matches your design) over one-off padding literals.
- Use a **memoized** `ItemSeparatorComponent` (see `CoursesScreen`’s `Separator`) or dedicated row spacing styles from `flashListRowSeparators`.
- Pass **`extraData`** when row content depends on locale (e.g. `i18n.language`) so FlashList re-renders when copy changes.

### Memoization

- **Screens** that only depend on props from navigation + hooks are wrapped with **`React.memo`** where already established (`CoursesScreen`, etc.) — follow that pattern for new heavy screens.
- **List items** (`CourseListCard`, `AlbumListCard`, …) are memoized components; keep **props stable** (avoid inline lambdas that change identity every render unless necessary).

### Avoiding re-renders

- Derive **`listData`** once per render (`const listData = data ?? []`) rather than mutating state in render.
- For style objects that depend on theme, use **`useMemo`** + `StyleSheet.create` inside hooks (`useProductListCardStyles`), not new object literals in JSX.

### Inline styles

- Small one-offs (`{ flex: 1 }`) are acceptable; **do not** encode design tokens (colors, spacing scale) inline — use theme + `StyleSheet`.

---

## 7. Developer guideline (critical)

### 7.1 Adding a new screen

1. **Create** `src/screens/MyNewScreen.tsx` (PascalCase file name matching the export).
2. **Types**: extend **`TabParamList`** or **`DrawerParamList`** in `src/navigation/types.ts` with the route name and params (use `undefined` if no params).
3. **Wire navigation** in `src/navigation/rootNavigator.tsx`:
   - For a **main tab**: add an entry under `mainTabs.screens` in `createBottomTabNavigator` and ensure `MainTabScreenName` / tab bar glyph handling in `tabBarConfig.tsx` if you use custom icons.
   - For a **drawer-only** leaf: add under `createDrawerNavigator` `screens` with `options: () => extraDrawerOptions(...)` pattern used by peers.
4. **i18n**: add `tabs.*` or `drawer.*` keys (see `src/navigation/i18nScreenOptions.ts` — `getTranslatedTabFields` uses `tabs.${routeName.toLowerCase()}`).
5. **Structure the screen**:
   - Top: types + navigation props (`BottomTabScreenProps` / drawer props).
   - Data: **`useXxxQuery`** from `src/features/.../hooks`.
   - UI: feature components + `SafeAreaView` / loading / error branches.
   - Styles: if large, add `src/screens/themed/myNewScreen.styles.ts` and a `useMyNewScreenStyles` hook.

### 7.2 Adding a new tab

1. **Screen component** in `src/screens/`.
2. **`TabParamList`** in `src/navigation/types.ts`.
3. **`rootNavigator.tsx`** → `mainTabs` `screens: { …, MyTab: MyTabScreen }`.
4. **`mainTabsScreenOptions`** already applies `lazy: true` — keep it unless you have a strong reason to eager-load.
5. **`tabBarConfig.tsx`**: add a case for `TabBarGlyph` / route name so the tab icon and optional badge behave correctly.
6. **Translations**: `tabs.mytab` (key must match lowercased route name logic in `getTranslatedTabFields`).

**Performance:** tabs are **lazy**; keep tab screens from importing heavy native modules at module top unless needed.

### 7.3 Adding a drawer item

1. **Screen** (new or reuse placeholder like `LegacyMenuPlaceholderScreen`).
2. **`DrawerParamList`** — add the route key (PascalCase).
3. **`rootNavigator.tsx`** — under drawer `screens`, add:

   ```tsx
   MyFeature: {
     screen: MyFeatureScreen,
     options: () => extraLeafOptions('myFeature', '🎯'),
   },
   ```

4. **`i18nScreenOptions.ts`** — extend **`EXTRA_DRAWER_LABELS`** with `myFeature: 'drawer.myFeature'` and add the string under `src/translations/`.
5. **Icons**: `drawerIcon('…')` uses a simple emoji glyph today; keep labels **from i18n**, not hardcoded user-visible strings in the navigator.

**Linking:** drawer items are **routes** on the drawer navigator; use `navigation.navigate('MyFeature')` from children.

### 7.4 Creating components

| Use `src/components/` when… | Use `src/features/<x>/components/` when… |
|-----------------------------|-------------------------------------------|
| App chrome, drawers, scaffolds, buttons shared by many domains | The UI represents **domain data** (course, album, FAQ row) |

**Splitting:** if a file exceeds ~200–300 lines, extract subcomponents (same file or colocated `MyScreenParts.tsx`).

**Prop drilling:** prefer passing **narrow props** or **context** only where multiple levels truly need it; for server data, **colocate query in the screen** and pass **DTOs** down.

**Memoization:** wrap list rows and expensive subtrees in `React.memo`; pass **stable** callbacks (`useCallback`) when rows subscribe to them.

### 7.5 Using theme

```tsx
import { spacing, pickSemantic, useNavScreenShellStyles } from '@/theme';
import { useTheme } from '@react-navigation/native';
```

- **`useAppTheme()`** when you need **app-level** scheme / navigation theme object (see `App.tsx` / settings flows).
- **`useTheme()`** from React Navigation inside most UI for **`colors`** aligned with nav.

**Do not** hardcode brand colors for semantic roles — extend **`semantic.ts`** if you need a new role.

### 7.6 API / data layer

| Piece | Location |
|-------|----------|
| HTTP (or mock delay) function | `src/features/<feature>/api/fetchXxx.ts` |
| React Query hook | `src/features/<feature>/hooks/useXxxQuery.ts` |
| Query key | `src/features/<feature>/constants/queryKeys.ts` |
| Types + seed data | `src/features/<feature>/data/` |

**Caching:** hooks set `staleTime` (e.g. 5 minutes for albums). Adjust per resource volatility. When adding real APIs, keep **`queryKey`** stable and include **language** or **filters** in the key if the response depends on them.

**Cross-feature shared API:** rare — if truly shared, add `src/lib/apiClient.ts` (or similar) **without** importing feature-specific types into `lib`.

### 7.7 Folder naming rules

| Area | Convention | Example |
|------|------------|---------|
| Screens | **PascalCase** file | `HomeScreen.tsx` |
| Feature folders | **camelCase** domain slug | `liveMeetings/`, `publicAlbums/` |
| Components | **PascalCase** | `CourseListCard.tsx` |
| Hooks | **`use` + PascalCase** file | `useCoursesQuery.ts` |
| Style hooks | **`useXxxStyles`** in `*.styles.ts` | `useNavScreenShellStyles` |
| Stores | **`*.store.ts`** | `language.store.ts` |

### 7.8 Do & don’t (summary)

**Do**

- Keep **screens thin**; push domain UI to **features**.
- Use **`@/` imports** for everything under `src/`.
- Add **query keys** next to the feature; invalidate/refetch deliberately when mutating.
- Reuse **`ScreenScaffold`**, nav shell styles, and FlashList tokens.

**Don’t**

- Add **new business API** calls inside `components/` or random `utils/` files.
- **Duplicate** drawer/tab wiring in multiple navigators — only **`rootNavigator.tsx`** defines the tree.
- **Bypass** TypeScript route types when calling `navigate`.
- Grow **god files** (>400 lines) without splitting.

---

## 8. Example implementation

### Bad (avoid)

```tsx
// Anti-pattern: magic numbers, inline everything, no query layer, unstable list callback
export function BadCourses() {
  return (
    <FlashList
      data={[]}
      renderItem={({ item }) => (
        <View style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
          <Text style={{ color: '#111', fontSize: 18 }}>{item.title}</Text>
        </View>
      )}
    />
  );
}
```

### Good (align with this repo)

```tsx
import * as React from 'react';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

import { CourseListCard } from '@/features/courses/components/CourseListCard';
import type { Course } from '@/features/courses/data/seedCourses';
import { useCoursesQuery } from '@/features/courses/hooks/useCoursesQuery';
import {
  flashListContentGutters,
  flashListEstimatedItemSize,
  useNavScreenShellStyles,
} from '@/theme';

const renderItem: ListRenderItem<Course> = ({ item }) => (
  <CourseListCard course={item} />
);

function keyExtractor(item: Course) {
  return String(item.id);
}

export const GoodCoursesScreen = React.memo(function GoodCoursesScreen() {
  const { data } = useCoursesQuery();
  const { colors } = useTheme();
  const shell = useNavScreenShellStyles(colors);

  return (
    <SafeAreaView style={shell.safe} edges={['left', 'right', 'bottom']}>
      <FlashList<Course>
        data={data ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={flashListEstimatedItemSize.course}
        contentContainerStyle={flashListContentGutters.standard}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
});
```

---

## 9. Future improvements (optional backlog)

- **Testing:** expand Jest beyond smoke test; add React Native Testing Library for screens and MSW (or similar) when real APIs land.
- **Observability:** crash reporting and performance traces (e.g. startup, list scroll FPS).
- **Theming:** additional **high-contrast** or **AMOLED** schemes on top of existing light/dark semantic model.
- **Networking:** central `apiClient` with interceptors, auth refresh, and typed errors — keep **`features/*/api`** as the only import surface for domain calls.

---

## Quick reference: import alias

```tsx
import { useAlbumsQuery } from '@/features/albums/hooks/useAlbumsQuery';
import { rootNavigator } from '@/navigation/rootNavigator';
import { spacing, pickSemantic } from '@/theme';
```

Root-only files (`App.tsx`, `__tests__/App.test.tsx`) may still use relative imports for paths **outside** `src/` (e.g. `../App`).

---

*Maintainers: when you change navigation or theme contracts, update this README in the same PR so onboarding stays accurate.*
