# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
yarn start              # Start Metro bundler
yarn android            # Run on Android
yarn ios                # Run on iOS

# Builds
yarn android:apk        # Android release APK
yarn android:bundle     # Android App Bundle

# Quality
yarn lint               # ESLint on src/**/*.{ts,tsx}
yarn test               # Run all Jest tests
yarn test -- --testPathPattern=<file>  # Run single test file

# Logs
yarn see:logs           # Android logs via adb logcat
```

**Node requirement:** `>= 22.11.0`

## Architecture Overview

Four layers with strict, enforced import direction:

```
app → domains → shared
app →           shared → (external only)
app →                    ui → (shared/contracts only)
```

`eslint-plugin-boundaries` enforces these rules — `shared` and `ui` must never import from `domains`.

### Layer Responsibilities

| Layer | Location | Purpose |
|-------|----------|---------|
| **app** | `src/app/` | Shell composition, navigation bootstrap, providers. No business logic. |
| **domains** | `src/domains/` | Feature modules: `albums`, `auth`, `basket`, `courses`, `donation`, `events`, `experiences`, `home`, `live`, `search`, `settings`, `support`, `user` |
| **shared** | `src/shared/` | HTTP client, storage, auth401, i18n, contracts, pagination utilities |
| **ui** | `src/ui/` | Design tokens, theme provider, global components |

### Domain Structure

Each domain follows this internal structure:
```
src/domains/<name>/
  api/        # Async fetchers — no React hooks, no getApiClient() in screens
  model/      # DTOs, Zod schemas, Zustand stores, constants
  hooks/      # React Query hooks and composition hooks
  screens/    # Route screens — use domain hooks only, never call getApiClient() directly
  ui/         # Domain-scoped components
  index.ts    # Public surface
```

## Navigation

Built with React Navigation 7 using a static configuration in [src/app/bridge/rootNavigator.tsx](src/app/bridge/rootNavigator.tsx):

- **Root:** Drawer navigator (RTL-aware — opens on right for Persian)
- **Main content:** Bottom tab navigator with 6 tabs (`Home`, `PublicCourses`, `PublicAlbums`, `Cart`, `Faqs`, `Profile`)
- **Drawer routes:** Secondary screens (Settings, Account, MyCourses, LiveMeetings, Events, etc.)
- **Placeholder routes:** Podcast, Meditation, Reading, Listening, Writing, PrivateConsultation, AboutUs, Collaboration, LiveMeetingOverview render `LegacyMenuPlaceholderScreen` — stubs for planned features; replace when implementing.

Navigation types (`TabParamList`, `DrawerParamList`) are in [src/shared/contracts/navigationApp.ts](src/shared/contracts/navigationApp.ts). Donation-specific route params are in [src/shared/contracts/navigationDonation.ts](src/shared/contracts/navigationDonation.ts).

**Typed navigation hook:** Always use `useAppNavigation()` from `@/shared/lib/navigation/useAppNavigation` in screens — it returns a composite type covering both tab and drawer surfaces. Do not call `useNavigation()` directly.

**Cross-navigator navigation:** `navigateToAppLeaf(navigation, routeName, params?)` from `@/app/bridge/auth` navigates to any tab or drawer leaf, handling the `MainTabs` nesting automatically.

**Auth-gated routes** use `protectedNavigate()` / `protectedPush()` — these queue an intent in the auth store. After login, `completePendingAuthNavigation()` replays the queued destination. Parallel 401 responses coalesce into a single Login navigation via the centralized 401 handler in `src/shared/infra/auth401/`.

**Deep linking:** Scheme `innoghte://` (from `APP_LINKING_PREFIXES`). Unauthenticated deep links are intercepted by `createAuthAwareGetStateFromPath` — it saves the target as `pendingNavigation` and redirects to Login; after login the destination is replayed automatically.

Global imperative navigation uses `navigationRef` from `src/shared/infra/navigation/navigationRef.ts`.

## State Management

**Zustand v5** for global/persistent state, **TanStack Query v5** for server state.

Key Zustand stores:
- `useAuthStore` — `isAuthenticated`, `accessToken`, `pendingNavigation`; persisted to secure MMKV; only `isAuthenticated` and `accessToken` are serialized
- `useUiThemeStore` — `preference: 'light' | 'dark' | 'system'`; persisted to default MMKV

**Cross-domain auth rule:** Code outside the `auth` domain must never import `useAuthStore` directly. Use `AuthService` from `@/domains/auth` instead — it is the public surface for session reads (`getToken`, `isAuthenticated`), mutations (`login`, `logout`, `clearSessionTokensOnly`), and pending navigation (`setPendingNavigation`, `consumePendingNavigation`).

**Cross-domain user rule:** Code outside the `user` domain must never read `usePurchasedProductIdsStore` directly. Use `UserService` from `@/domains/user` for purchase checks and mutations (`registerPurchaseLookup`, `refreshPurchasedProductIds`, `clearPurchasedProductIds`).

React Query client (`src/app/queryClient.ts`) is configured with `retry: false` — retries are handled at the HTTP layer by Ky (1 retry for GETs on 408/429/5xx with exponential backoff).

## HTTP Client

Ky v2 client initialized at startup as a side-effect in [src/app/bridge/wireAppHttpClient.ts](src/app/bridge/wireAppHttpClient.ts).

- **Getter:** `getApiClient()` — throws if called before initialization
- **Base URL:** `API_BASE_URL` or `REACT_NATIVE_API_URL` env var; defaults to staging
- **Auth:** Bearer token injected via Ky hook; `getAccessToken()` reads Zustand store (works before rehydration)
- **Validation:** `parseJsonResponse(request, ZodSchema?)` — Zod schemas preferred for auth/sensitive boundaries
- **Endpoints:** Defined in `src/shared/infra/http/endpoints.ts` — no leading slashes

## Theming

Theme tokens live in `src/ui/theme/`:
- `dark.ts` is the source of truth for all semantic tokens
- `light.ts` composes from dark and overrides only diverging values
- `colors.ts` holds raw color scales; UI code consumes `theme.colors.*` (semantic roles)

`AppThemeProvider` is wired in `BridgeShell`. Color scheme resolves as: `resolveColorScheme(preference, systemScheme)` where `preference` comes from `useUiThemeStore`.

## i18n

i18next v26 + react-i18next v17. Languages: `en` (fallback) and `fa` (Farsi/Persian, default).

- JSON resources: `src/shared/infra/i18n/en.json`, `fa.json`
- Initialized in `index.js` bootstrap via `initI18n(lng)` before `App` registers
- RTL applied at startup via `applyRtlForLanguage(lng)`
- Language preference persisted via MMKV; read at startup with `readAppLanguageFromStorage()`
- Use `useTranslation()` hook for reactive text; add `key={i18n.language}` to screens/lists that need full remount on language change
- **Language change** triggers a full app reload via `react-native-restart` (in `settings` domain) — RTL direction cannot be changed at runtime without a reload

## Bootstrap Order

1. `index.js` — RTL, i18n init, register App
2. `src/app/App.tsx` — imports `wireAppHttpClient` (side-effect), wraps with `RootProviders`
3. `RootProviders` — i18next, QueryClient, SafeAreaProvider, BridgeShell
4. `BridgeShell` — ErrorBoundary, AppThemeProvider, StatusBarChrome, auth+theme wiring

## Key Shared Utilities

- **`src/shared/lib/infiniteList/`** — `useAppInfiniteList`: wraps `useInfiniteQuery` with memoized `flatData`, scroll-offset memory (LRU 30 keys), pagination backoff (300/600/1200 ms)
- **`src/shared/ui/list-states/`** — `ListStateView`, `LoadingState`, `ErrorState`, `EmptyState`, `ListFooterLoader` — use these for all list screens instead of per-screen duplicates
- **`src/shared/infra/auth401/`** — per-request policy via `withKyAuth401Context(...)`, per-screen scope via `useAuth401ScreenScope`
- **`resolveErrorMessage(err, fallback)`** from `@/shared/infra/http` — extracts a user-visible string from `ApiError` (reads `.payload.message` first) or any `Error`; returns `fallback` when no message is available
- **`fireAndForget(promise)`** from `@/shared/infra/http` — wraps fire-and-forget API calls; errors propagate through the global `onApiError` pipeline so callers never silently swallow failures
- **`formatTsIso(iso, locale)`** from `@/shared/utils/formatTsIso` — formats ISO date strings for display; passes `'fa-IR'` locale for Persian, default `toLocaleString` otherwise
- **`ScreenScaffold`** from `@/ui/components/ScreenScaffold` — thin wrapper with optional `title`/`subtitle` text + `ErrorBoundary`; use for simple non-list screens that don't need a custom shell
- **`useQueryCache<T>(queryKey)`** from `@/shared/lib/react-query/useQueryCache` — optimistic cache mutations (`addItem`, `removeItem`) for items with numeric `id`; use for immediate UI feedback on cart/basket operations
- **`Swiper`** from `@/shared/ui/Swiper` — generic horizontal carousel built on `FlatList`; accepts `renderItem`, `itemWidth`, `gap`, optional `contentInsetStart` for peek effect, and pagination dots

## Path Aliases

`@/*` maps to `src/*` (configured in `tsconfig.json`, `babel.config.js`, and Jest). Always use `@/` imports rather than relative parent paths.

## SVG Icons

SVGs in `src/assets/icons/` are compiled to React components by `react-native-svg-transformer` (configured in `metro.config.js`). Import directly: `import VerifyIcon from '@/assets/icons/verify.svg'`.

## Multi-Region (IR vs COM)

The app targets two regions: Iran (`.ir`) and international (`.com`). Region is resolved once at startup:

- **Config:** `isDotIr` from `@/shared/config` — returns `true` when `REACT_NATIVE_IS_DOT_IR === 'ir'`
- **Scope header:** API calls that differ by region inject `{ Scope: 'ir' | 'com' }` via a `scopeHeader()` helper
- **Feature flags:** Gateway visibility (Zarinpal, Vandar) is controlled by env vars checked in `src/domains/donation/model/env.ts`

**Env var inlining:** `REACT_NATIVE_IS_DOT_IR`, `REACT_NATIVE_API_URL`, and other `REACT_NATIVE_*` vars are **inlined at compile time** by `babel-plugin-transform-inline-environment-variables` — set them before bundling, not at runtime.

## Forms

Forms use **react-hook-form v7** with **Zod** schemas via `zodResolver` from `@hookform/resolvers/zod`.

- Schema + type defined in `model/schema.ts` (or `model/*FormSchema.ts`) inside the domain
- Payment flows use `z.discriminatedUnion('paymentType', [...])` to conditionally require credit card fields vs. PayPal — see `basket` or `donation` domains for the pattern
- `InputField` from `@/ui/components/form/InputField` — themed text input that accepts `error` prop
- `form.register(field)` is called manually (RN doesn't use native DOM refs), then `form.setValue` on change and `form.trigger` on blur
- `form.handleSubmit(handler)` wraps submit; pass `isSubmitting` state down to disable the button

## Lists (FlashList)

Performant lists use `@shopify/flash-list`. Theme helpers from `@/ui/theme` keep list chrome consistent:

- `flashListEstimatedItemSize.<kind>` — pre-tuned `estimatedItemSize` per card type
- `flashListContentGutters.standard` — standard `contentContainerStyle` padding
- `flashListRowSeparators.h12` — `ItemSeparatorComponent` view with 12 dp gap
- `useNavScreenShellStyles(colors)` — styles for loading/error/safe-area wrappers on full-screen list screens

**Device-aware tuning:** `useListPerformanceProfile()` from `@/shared/infra/device/listPerformanceProfile` auto-detects Android ≤ API 29 ("low" tier) and adjusts `estimatedItemSizeFactor`, `onEndReachedThreshold`, `scrollEventThrottle`, and `decelerationRate`. Use it in list screens instead of hardcoding those props.

## Collapsible Header

Three components + one hook, all from `@/shared/ui/collapsibleHeader`:

1. `useCollapsibleHeader()` — returns `{ scrollY, onScroll, threshold }` (Reanimated shared value + event handler)
2. `CollapsibleHeader` — absolutely positioned animated header; pass `scrollY`, `threshold`, `backgroundColor`, `expandedBackgroundColor`
3. `CollapsibleHeaderFlatList` / `CollapsibleHeaderScrollView` — Reanimated list/scroll wrappers preconfigured for `scrollEventThrottle`; pass `onScroll` from the hook

## Toast

`showAppToast(message, kind)` from `@/shared/ui/toast` — imperative, event-bus driven. `ToastHost` is mounted once inside `AppThemeProvider` and listens for events. Call from anywhere (hooks, api layer, etc.) without a React context.

```ts
import { showAppToast } from '@/shared/ui/toast';
showAppToast('Saved', 'success');
showAppToast('Something went wrong', 'error');
```

## Styling Convention

Style factories are functions that take `colors` (from `useTheme().colors` or `useThemeColors()`) and return a `StyleSheet.create(...)` object. Each screen/component owns a `*.styles.ts` file alongside it:

```ts
// myFeature.styles.ts
export function useMyFeatureStyles(colors: ThemeColors) {
  return StyleSheet.create({ root: { backgroundColor: colors.background } });
}

// MyFeatureScreen.tsx
const { colors } = useTheme();
const s = useMyFeatureStyles(colors);
```

Never pass raw color strings; always go through `theme.colors.*` semantic tokens.

## Purchases

Product ownership uses a port/adapter pattern to decouple the `user` domain from consumers:

- **Port** (`@/shared/purchases`) — defines `IsProductPurchased` type; consumers call `isProductPurchased(productId)` from this package, never from the user domain store directly
- **Adapter** (`src/shared/purchases/adapter.ts`) — holds the registered lookup function; defaults to `() => false` until wired
- **Wiring** — `UserService.registerPurchaseLookup()` is called once as a module side-effect in `BridgeShell.tsx`; it connects the `user` domain's Zustand store snapshot to the port

## Storage Keys

Shared MMKV persistence keys are defined in `src/shared/infra/persistence/appStorageKeys.ts`. The newer `basket`, `donation`, and `user/giveGift` features define their own domain-scoped key files (`model/storageKeys.ts` or `model/*.storageKeys.ts`) instead of centralizing them — follow the same pattern for those domains rather than adding to `appStorageKeys.ts`.

**Storage adapter:** `createStorageServiceAdapter()` from `@/shared/infra/storage` returns a Zustand `StateStorage` backed by MMKV — use it when a Zustand store needs `createJSONStorage()` with the app's MMKV instance.

## Startup Screen

`StartupScreen` is shown exactly once on first launch via `useStartupOnFirstLaunch()` (called inside the navigation container). After the user taps any CTA, `markStartupSeen()` persists the `STARTUP_SEEN_KEY` flag to MMKV so the screen is never auto-navigated to again. Subsequent launches skip it entirely.

## Basket Domain

The `basket` domain manages the shopping cart. Key patterns:

- **`useBasketCheckoutStore`** — persisted Zustand store tracking `termsAccepted`, `paymentMethod` (`'paypal' | 'credit_card'`), `gatewayName` (`'zarinpal' | 'vandar'`), `pendingDiscountCode`, and `autoResumeCheckout`
- **`useBasketDiscountStore`** — in-memory (non-persisted) store for current discount state
- **Cart tab icon:** `BasketTabBarIcon` in `src/app/bridge/` reads `useBasketCart()` to show a badge count — it is wired in `mainTabsScreenOptions()` via a callback wrapper
- Query keys are domain-scoped in `src/domains/basket/model/queryKeys.ts`

## Donation Domain

The `donation` domain handles a multi-step payment flow with gateway selection and callback verification:

- **State machine:** `useDonationFlow()` drives a pure (non-library) state machine in `model/donationFlowMachine.ts`. States: `idle → creating_checkout → checkout_ready → redirecting → verifying → success|error`. Dispatch transitions via the hook, not by mutating store directly.
- **Callback parsing:** Payment gateways redirect back with query params. `mergeDonationCallbackSources()` and `parsePaymentParamsFromUrl()` in `model/donationCallbackParams.ts` merge params from three sources (discrete nav params, `returnUrl` query string, URL capture) with defined precedence. `donationVerificationFingerprint()` produces a dedup key to coalesce parallel verify calls.
- **Route params:** `DonationScreenParams` in [src/shared/contracts/navigationDonation.ts](src/shared/contracts/navigationDonation.ts) captures all possible gateway callback fields (`Authority`, `Status`, `paymentId`, `PayerID`, `token`, `payment_status`, `returnUrl`, `gatewayName`).

## GiveGift Feature (user domain)

The `giveGift` feature inside the `user` domain creates an anonymous cart and presents products as gifts:

- **Anonymous cart token:** `readOrCreateCartToken()` in `model/giveGiftCartToken.ts` generates and persists a UUID via MMKV — this token is shared with the web app (key `'cart_token'`), so do not rename it
- **Form schema:** `model/giveGiftFormSchema.ts` uses `.superRefine()` to require ≥1 product selection within the chosen `selectionGroup` (`courses | albums | rooyeKhats | audioBooks`)
- **Orchestration:** `services/completeGiveGiftFlow.ts` sequences: create present → persist mapping → clear anonymous cart → re-add selected products

## Status Bar

`useScreenStatusBar(backgroundColor?)` from `@/ui/statusBar` — call inside a screen to declare its status bar style. Auto-infers `barStyle` from background color brightness. Uses `useFocusEffect` so it restores the global baseline on blur. For simple use, render `<ScreenStatusBar backgroundColor={colors.background} />` instead of calling the hook directly.

## Build Notes

- **Reanimated plugin** must be the **last entry** in `plugins` in `babel.config.js` — moving it earlier breaks worklet compilation.
- **SVGs** are tree-shakeable modules at bundle time via `react-native-svg-transformer` (configured in `metro.config.js`).
- **Android layout animation** is enabled once in `index.js` via `UIManager.setLayoutAnimationEnabledExperimental(true)` — required for animated expand/collapse UI on Android.

## Debug Tooling

**Reactotron** is configured in `reactotron.config.ts` (MMKV plugin included). It is imported as a side-effect in `index.js` in development only. Use the Reactotron desktop app to inspect network requests, Zustand/MMKV state, and custom log events without `console.log`.
