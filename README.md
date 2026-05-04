# Innoghte — React Native App

A full-featured educational platform app built with React Native (bare CLI), TypeScript, and a strict domain-driven architecture.

---

## Tech Stack

| Concern | Library |
| --- | --- |
| Framework | React Native (bare CLI) |
| Language | TypeScript (strict) |
| Navigation | React Navigation 7 (static config) |
| Server state | TanStack Query v5 |
| Global state | Zustand v5 |
| Forms | react-hook-form v7 + Zod |
| HTTP | Ky v2 |
| Storage | MMKV |
| Animations | Reanimated 3 |
| i18n | i18next v26 (FA default, EN fallback) |
| Lists | @shopify/flash-list |

**Node requirement:** `>= 22.11.0`

---

## Architecture Overview

The project is split into four strict layers. Import direction is one-way and enforced by `eslint-plugin-boundaries`:

```text
app  →  domains  →  shared
app  →             shared  →  (external only)
app  →                        ui  →  (shared/contracts only)
```

```text
src/
  app/       → Shell wiring: navigation, providers, bootstrap
  domains/   → Business feature modules
  shared/    → Cross-domain infrastructure and utilities
  ui/        → Design system: theme, tokens, layout components
  assets/    → Fonts, icons, images
  types/     → Global ambient declarations (svg.d.ts, process-env.d.ts)
```

### `src/app/`

Application shell. No business logic lives here.

```text
app/
  App.tsx                      ← Root component; installs HTTP client + navigation guard
  bridge/                      ← Cross-cutting wiring (only layer allowed to import from domains)
    auth/
      useAuthBootstrap.ts      ← Startup auth gate hook
      navigationGuard.ts       ← Runtime session enforcement
      protectedNavigation.ts   ← protectedNavigate / protectedPush helpers
      linkingAuth.ts           ← Deep-link auth interception
    rootNavigator.tsx          ← Full static navigator tree (drawer + tabs)
    BridgeShell.tsx            ← Theme, auth state, user wiring
    wireAppHttpClient.ts       ← HTTP client initialization (side-effect import)
    BasketTabBarIcon.tsx        ← Cart badge tab icon
    ProfileTabBar.tsx           ← Personalized profile tab
  navigation/
    i18nScreenOptions.ts        ← Translated screen labels
    drawerLayout.ts             ← RTL/LTR drawer helpers
    tabBarConfig.tsx            ← Tab bar glyph icons
    LegacyMenuPlaceholderScreen.tsx  ← Stub for unimplemented routes
  providers/
    RootProviders.tsx           ← i18next, QueryClient, SafeArea, BridgeShell
  splash/
    SplashScreen.tsx            ← Animated startup screen + auth dispatch
  examples/
    CollapsibleHeaderExampleScreen.tsx  ← Dev demo (collapsible header)
  queryClient.ts                ← TanStack Query client (retry: false)
```

### `src/domains/`

Each self-contained business feature. See [Domain Architecture](#domain-architecture) below.

Active domains: `auth`, `albums`, `basket`, `collaboration`, `contact`, `courses`, `donation`, `events`, `experiences`, `home`, `legal`, `live`, `search`, `settings`, `support`, `transactions`, `user`

### `src/shared/`

Pure cross-domain utilities. Must never import from `domains/`.

```text
shared/
  config/       → Feature flags (isDotIr, publicWebOrigin, fonts)
  contracts/    → Shared TypeScript types and interfaces
  infra/
    auth401/    → Global 401 handler (Ky hook + per-screen policy)
    device/     → Device capability detection
    http/       → HTTP client factory, Zod parsers, error helpers
    i18n/       → i18next setup, EN/FA JSON resources
    locale/     → Language storage reader
    navigation/ → Global navigationRef
    persistence/ → MMKV storage keys
    storage/    → MMKV adapter, Zustand storage bridge
  lib/
    infiniteList/   → useAppInfiniteList (infinite scroll + scroll memory)
    navigation/     → useAppNavigation typed hook
    react-query/    → useQueryCache (optimistic cache mutations)
  purchases/    → Port/adapter for product ownership (decouples user domain)
  ui/           → Shared feature-level UI (CollapsibleHeader, Toast, Swiper, etc.)
  utils/        → Pure utility functions
```

### `src/ui/`

Design system only. No business logic, no domain imports.

```text
ui/
  theme/        → Semantic tokens, dark/light themes, color scales, typography
  components/   → Generic UI primitives (Button, InputField, ScreenScaffold, etc.)
  layout/       → CustomDrawerContent, ShellDrawerContext
  statusBar/    → useScreenStatusBar, ScreenStatusBar
```

---

## Domain Architecture

A **domain** is a self-contained feature module. It owns its data fetching, business logic, components, and screens. Domains communicate with each other only through their public `index.ts` surface.

### Standard Folder Structure

```text
src/domains/<name>/
  api/          → Async fetchers — plain functions, no hooks, no React
  hooks/        → React Query hooks + composition hooks
  model/        → DTOs, Zod schemas, form schemas, Zustand stores, constants
  screens/      → Route-level screen components
  components/   → Domain-scoped UI components (some domains use ui/ instead)
  ui/           → Domain-scoped styles and presentational pieces
  services/     → Multi-step orchestration (not fetchers, not hooks)
  utils/        → Domain-local pure utilities
  store/        → Zustand stores (when separate from model/)
  index.ts      → Public surface — export ONLY what other layers need
```

### Rules

- **`api/`** — Only plain async functions. Never call `getApiClient()` in a screen directly.
- **`hooks/`** — All React Query hooks live here. Never put query logic in screens.
- **`screens/`** — Consume domain hooks only. Zero direct API calls.
- **`model/`** — DTOs, Zod schemas, form schemas, query keys, constants. No side effects.
- **`index.ts`** — Barrel with only the public surface. Do not leak internals.
- **`services/`** — Use for multi-step flows that coordinate API + store + navigation.

### Creating a New Domain

1. Create `src/domains/<name>/` with the subfolders you need.
2. Define DTOs and Zod schemas in `model/`.
3. Write fetchers in `api/`.
4. Wrap fetchers in React Query hooks in `hooks/`.
5. Build screen components in `screens/` using only the hooks.
6. Export the public surface from `index.ts`.
7. Register the screen(s) in `src/app/bridge/rootNavigator.tsx`.
8. Add the route to `DrawerParamList` / `TabParamList` in `src/shared/contracts/navigationApp.ts`.

---

## Authentication Flow

### Startup (SplashScreen)

Every app launch goes through `SplashScreen` (`src/app/splash/SplashScreen.tsx`). The screen runs a minimum 1200 ms display timer in parallel with the auth check:

```text
App launches
  └─► Drawer initialRouteName = 'Splash'
        └─► useAuthBootstrap()
              ├─► No token in storage → 'unauthenticated'
              └─► Token present → GET /auth/user (no_redirect 401 strategy)
                    ├─► 200 OK → 'authenticated'
                    │     └─► CommonActions.reset → MainTabs
                    └─► Any error → clear token + RQ cache → 'unauthenticated'
                          └─► CommonActions.reset → AuthEntry
```

`CommonActions.reset()` removes Splash from navigation history — Android back cannot return to it.

The `no_redirect` strategy on `getUserForSplash()` prevents the global 401 handler from racing with SplashScreen's own navigation during bootstrap.

### Runtime Guard (`navigationGuard.ts`)

After bootstrap, `navigationGuard` is installed once in `App.tsx`. It listens to two signals:

1. **Nav state changes** — checks if the focused leaf is in `PUBLIC_LEAF_ROUTE_NAMES`. If not, and the session is invalid, resets to `AuthEntry`.
2. **Auth store changes** — when `accessToken` or `isAuthenticated` clears, schedules enforcement via `queueMicrotask`.

Public routes (no session required): `Splash`, `AuthEntry`, `Login`, `Register`, `Verify`.

### Logout

`performAppLogout()` (`src/domains/auth/hooks/useLogout.ts`):

1. Calls the remote revoke endpoint (best-effort).
2. Clears local session tokens and React Query cache.
3. The auth store change triggers `navigationGuard` → single `CommonActions.reset` to `AuthEntry`.

Navigation is **not dispatched inside logout** — the guard owns all navigation. This prevents duplicate resets.

Logout is **idempotent**: concurrent callers share one in-flight promise.

### 401 Mid-Session

When a protected API call returns 401 during normal use, `handleKy401` fires `safeNavigateToLoginFrom401()`. This coalesces parallel 401s into a single `navigate('Login')`.

Per-screen policy is set via `useAuth401ScreenScope` or `withKyAuth401Context`.

---

## Navigation System

Built with **React Navigation 7 static configuration**.

### Structure

```text
Drawer (rootNavigator)
  ├─ Splash          ← initialRouteName, hidden from drawer
  ├─ MainTabs        ← BottomTabNavigator
  │    ├─ Home
  │    ├─ PublicCourses
  │    ├─ PublicAlbums
  │    ├─ Cart
  │    └─ Profile
  ├─ Settings / Account / Security / EditProfile …
  ├─ AuthEntry / Login / Register / Verify
  └─ … (50+ drawer routes)
```

All route types are in `src/shared/contracts/navigationApp.ts` (`DrawerParamList`, `TabParamList`).

### Key Pieces

| File | Purpose |
| --- | --- |
| `src/app/bridge/rootNavigator.tsx` | Full static navigator tree |
| `src/shared/infra/navigation/navigationRef.ts` | Global imperative `navigationRef` |
| `src/shared/lib/navigation/useAppNavigation.ts` | Typed composite hook — always use this instead of `useNavigation()` |
| `src/app/bridge/auth/navigationGuard.ts` | Runtime session enforcement |
| `src/app/bridge/auth/protectedNavigation.ts` | `protectedNavigate()` — queues intent, replays after login |
| `src/app/bridge/auth/linkingAuth.ts` | Deep-link interception for unauthenticated users |

### Cross-Navigator Navigation

```ts
import { navigateToAppLeaf } from '@/app/bridge/auth';
navigateToAppLeaf(navigation, 'PublicCourseDetail', { courseId: 42 });
```

Handles `MainTabs` nesting automatically.

### Deep Linking

Scheme: `innoghte://`. Unauthenticated deep links are saved as `pendingNavigation` in the auth store and replayed after login via `completePendingAuthNavigation()`.

---

## Key Hooks

### `useAuthBootstrap` — `src/app/bridge/auth/useAuthBootstrap.ts`

Runs once on SplashScreen mount. Returns `'checking' | 'authenticated' | 'unauthenticated'`.

```ts
const status = useAuthBootstrap();
// When status !== 'checking', dispatch navigation reset
```

Used exclusively by `SplashScreen`. Do not use elsewhere.

---

### `useLogout` — `src/domains/auth/hooks/useLogout.ts`

Returns a stable callback that triggers full app logout.

```ts
const logout = useLogout();
<Button onPress={logout} title="Sign out" />
```

Navigation is handled automatically by `navigationGuard` — callers do not need to redirect.

---

### `useCurrentUser` — `src/domains/auth/hooks/useCurrentUser.ts`

React Query hook for the authenticated user profile.

```ts
const { data: userRes } = useCurrentUser();
const user = userRes?.data;
```

---

### `useProtectedNavigation` — `src/domains/auth/hooks/useProtectedNavigation.ts`

Navigate to a protected route. If unauthenticated, saves the intent and goes to Login; after login the destination is replayed automatically.

```ts
const { protectedNavigate } = useProtectedNavigation();
protectedNavigate('CourseDetail', { courseId: 42 });
```

---

### `useAppNavigation` — `src/shared/lib/navigation/useAppNavigation.ts`

Typed replacement for `useNavigation()`. Always use this in screens.

```ts
const navigation = useAppNavigation();
navigation.navigate('Settings');
```

---

### `useAppInfiniteList` — `src/shared/lib/infiniteList/useAppInfiniteList.ts`

Wraps `useInfiniteQuery` with memoized `flatData`, scroll-offset memory (LRU 30 keys), and pagination backoff (300/600/1200 ms).

```ts
const { flatData, isFetchingNextPage, onEndReached, onScroll } =
  useAppInfiniteList({ queryKey, queryFn, ... });
```

---

### `useScreenStatusBar` / `ScreenStatusBar` — `src/ui/statusBar/`

Declares status bar style for the focused screen. Auto-infers light/dark content from background brightness. Restores global baseline on blur.

```ts
// Hook form
useScreenStatusBar(colors.background);

// Component form (simpler)
<ScreenStatusBar backgroundColor={colors.background} />
```

---

### `useCollapsibleHeader` — `src/shared/ui/collapsibleHeader/`

```ts
const ch = useCollapsibleHeader({ backgroundColor, threshold, barHeight });
// Pair with <CollapsibleHeader scrollY={ch.scrollY} ...> and
// <CollapsibleHeaderScrollView onScroll={ch.onScroll} ...>
```

---

## State Management

### Server State — TanStack Query v5

All API data is cached through React Query. The client (`src/app/queryClient.ts`) is configured with `retry: false` — retries are handled at the Ky HTTP layer (1 retry for GETs on 408/429/5xx with exponential backoff).

Query keys are domain-scoped in each `model/queryKeys.ts`.

### Global State — Zustand v5 + MMKV

| Store | Location | Persisted | Purpose |
| --- | --- | --- | --- |
| `useAuthStore` | `domains/auth/model/auth.store.ts` | Yes (MMKV) | `isAuthenticated`, `accessToken`, `pendingNavigation` |
| `useUiThemeStore` | `domains/settings/model/uiTheme.store.ts` | Yes (MMKV) | Theme preference (`light/dark/system`) |
| `usePurchasedProductIdsStore` | `domains/user/model/purchases/` | No | Owned product IDs |
| `useBasketCheckoutStore` | `domains/basket/model/basketCheckout.store.ts` | Yes (MMKV) | Checkout state |

### Auth Store Access Policy

`useAuthStore` must **never** be imported outside the `auth` domain. Use `AuthService` from `@/domains/auth` for cross-domain session reads and mutations.

The internal `authStore` facade (`src/domains/auth/store/authStore.ts`) provides a synchronous, non-React API for infra code (navigation guard, HTTP hooks). It is marked **INTERNAL USE ONLY** and is **not** exported from the domain barrel — import it directly only inside `src/app/bridge/` or `src/shared/infra/`.

```ts
// ✅ Correct — from other domains or screens
import { AuthService } from '@/domains/auth';
const token = AuthService.getToken();

// ❌ Wrong — never in feature code
import { useAuthStore } from '@/domains/auth/model/auth.store';
import { authStore } from '@/domains/auth/store/authStore';
```

---

## Developer Guidelines

### Where to put new code

| What | Where |
| --- | --- |
| New screen | `src/domains/<name>/screens/` |
| New API fetcher | `src/domains/<name>/api/` |
| New React Query hook | `src/domains/<name>/hooks/` |
| New form schema (Zod) | `src/domains/<name>/model/<name>Form.schema.ts` |
| New domain-scoped component | `src/domains/<name>/components/` |
| New domain-scoped styles | `src/domains/<name>/ui/<name>.styles.ts` |
| Reusable UI primitive | `src/ui/components/` |
| Shared feature component | `src/shared/ui/` |
| Pure utility (no React) | `src/shared/utils/` |
| Shared type / interface | `src/shared/contracts/` |

### Naming conventions

- **Folders**: lowercase, single word or `kebab-case`
- **Component files**: `PascalCase.tsx`
- **Logic files**: `camelCase.ts`
- **Style files**: `camelCase.styles.ts` — export a `use<Name>Styles(colors)` hook
- **Form schemas**: `<name>Form.schema.ts` inside `model/`
- **Query keys**: constant objects in `model/queryKeys.ts`

### Do's

- Use `useAppNavigation()` instead of `useNavigation()` in screens
- Use `AuthService` for cross-domain auth reads
- Use `resolveErrorMessage(err, fallback)` to extract user-visible error strings
- Use `showAppToast(message, kind)` for imperative toasts
- Use `ScreenScaffold` for simple non-list screens
- Use `@/` absolute imports everywhere — never relative `../../`
- Put form schemas in `model/` alongside DTOs

### Don'ts

- Never call `getApiClient()` in a screen — put it in `api/` and wrap in a hook
- Never import `useAuthStore` outside the `auth` domain
- Never import `usePurchasedProductIdsStore` outside the `user` domain — use `UserService`
- Never add to `shared/` code that references a specific domain
- Never use full React Query result objects as `useEffect` dependencies (see Performance below)

---

## Performance Considerations

### Effect Dependencies

Never use full React Query result objects as `useEffect` deps — the object reference changes on every render:

```ts
// ❌ Runs on every render — query object is always a new reference
useEffect(() => { ... }, [iranQuery, paypalQuery]);

// ✅ Subscribe only to the specific values that matter
const { isSuccess, isError } = iranQuery;
useEffect(() => { ... }, [isSuccess, isError]);

// ✅ Pre-compute before the effect when conditional selection is needed
const activeIsSuccess = canVerifyIranian ? iranQuery.isSuccess : paypalQuery.isSuccess;
const activeIsError   = canVerifyIranian ? iranQuery.isError   : paypalQuery.isError;
useEffect(() => { ... }, [activeIsSuccess, activeIsError]);
```

### Memoization

- Wrap derived list data in `useMemo` (`data ?? []`) to prevent unnecessary FlashList re-renders when the component re-renders but the data reference is unchanged.
- Style factories use `React.useMemo` internally — pass stable args (semantic tokens are stable per theme change).
- Use `React.memo` on list item components.

### FlashList

Use theme helpers for consistent list performance:

```ts
estimatedItemSize={flashListEstimatedItemSize.courseCard}
contentContainerStyle={flashListContentGutters.standard}
ItemSeparatorComponent={flashListRowSeparators.h12}
```

For device-aware tuning on low-end Android:

```ts
const perf = useListPerformanceProfile();
// Provides estimatedItemSizeFactor, onEndReachedThreshold,
// scrollEventThrottle, decelerationRate
```

---

## Commands

```bash
yarn start              # Start Metro bundler
yarn android            # Run on Android
yarn ios                # Run on iOS
yarn android:apk        # Android release APK
yarn android:bundle     # Android App Bundle
yarn lint               # ESLint on src/**/*.{ts,tsx}
yarn test               # Run all Jest tests
yarn test -- --testPathPattern=<file>   # Single test file
yarn see:logs           # Android adb logcat
```

---

## Multi-Region

The app targets two regions: Iran (`.ir`) and international (`.com`).

- `isDotIr` from `@/shared/config` — `true` when `REACT_NATIVE_IS_DOT_IR === 'ir'`
- Region-specific API calls inject `{ Scope: 'ir' | 'com' }` via `scopeHeader()`
- Gateway visibility (Zarinpal, Vandar) controlled by env vars in `src/domains/donation/model/env.ts`
- All `REACT_NATIVE_*` env vars are **inlined at compile time** — set them before bundling

---

## Bootstrap Order

```text
index.js
  ├─ applyRtlForLanguage(lng)        ← RTL must be set before any render
  ├─ initI18n(lng)                   ← i18next initialized synchronously
  └─ AppRegistry.registerComponent('App')

App.tsx
  ├─ import wireAppHttpClient        ← HTTP client initialized as side-effect
  ├─ installNavigationGuard()        ← Session gate installed via useEffect
  └─ <RootProviders>
        └─ <BridgeShell>
              ├─ ErrorBoundary
              ├─ AppThemeProvider    ← Theme resolved from preference + system scheme
              ├─ StatusBarChrome
              └─ UserService.registerPurchaseLookup()  ← wires purchases port

Navigation
  └─ Drawer initialRouteName='Splash'
        └─ SplashScreen
              ├─ useAuthBootstrap()  ← token check → profile fetch (min 1200ms)
              └─ CommonActions.reset → MainTabs | AuthEntry
```
