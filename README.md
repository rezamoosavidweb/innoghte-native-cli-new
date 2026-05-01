# Innoghte — React Native Client

A production-oriented React Native app built with **strict layering**, **domain-driven** folders, and **ESLint boundary rules** so features can grow in isolation with minimal cross-coupling.

---

## Overview

- **Modular layout**: Work lives in `src/domains/<domain>`; the shell (navigation, providers, cross-domain wiring) lives in `src/app`.
- **Domain boundaries**: Each domain ships `api/`, `model/`, `hooks/`, `screens/`, and often `ui/`, with small public surfaces through `index.ts` where it helps.
- **Shared vs UI**: `src/shared` holds infrastructure, contracts, and **reusable cross-cutting UI** (e.g. `shared/ui/list-states`); `src/ui` is the design system and global layout. **`ui` does not import from `domains`**—shell data for chrome (e.g. drawer user) is passed via **`ShellDrawerContext`** from **`app/bridge/BridgeShell`**.

---

## Architecture

Four primary layers:

| Layer | Role |
|--------|------|
| **`app/`** | Bootstrap, static navigation, providers, `BridgeShell` composition, auth-aware navigation (`protectedNavigate`, `completePendingAuthNavigation`). No business rules—wiring only. |
| **`domains/`** | Business capabilities: auth, courses, media, live, events, settings, support, user, home, experiences, search, etc. |
| **`shared/`** | HTTP, storage adapters, i18n, query keys, navigation ref, contracts, purchase port, utilities. |
| **`ui/`** | Theme tokens, global components, layout (e.g. `CustomDrawerContent`), `ErrorBoundary`. |

**Dependency direction:** `app` → `domains` + `shared` + `ui`; `domains` → `shared` + `ui`; `shared` and `ui` must not depend on `domains` (enforced by `eslint-plugin-boundaries`).

```text
src/
├── app/                 # BridgeShell, root navigator, protected navigation, startup
├── domains/              # Feature domains
├── shared/              # Infra, contracts, cross-cutting utils
└── ui/                  # Design system, ErrorBoundary, drawer chrome
```

### Domain template

```text
domains/<domain>/
├── api/           # Async fetchers only (no React hooks)
├── model/         # DTOs, Zod schemas, Zustand stores, constants
├── hooks/         # React Query, composition hooks
├── screens/       # Route screens: hooks + layout (no direct getApiClient)
├── ui/            # Domain-scoped components
└── index.ts       # Public exports (optional)
```

**Examples in this repo:** `auth`, `basket`, `courses`, `donation`, `events`, `experiences`, `home`, `live`, `media`, `search`, `settings`, `support` (e.g. `faqs/`), `user`.

Subdomains (e.g. `support/faqs/`) mirror the same internal layout when a feature is large enough.

---

## Data flow

```text
Screen → hook (React Query / Zustand) → api/ → HTTP → backend
          ↓
        model / cache
```

- **Navigation after login** — `LoginScreen` calls `completePendingAuthNavigation()` so intents queued by `protectedNavigate` / `protectedPush` are applied instead of a hardcoded destination.
- **Auth-gated routes** — Tab (`Profile`) and selected drawer items (`MyCourses`, `LiveMeetings`, `Events`) use listeners to send unauthenticated users through the same flow.

---

## 🔐 Authentication & 401 Handling

The app treats **session + navigation after auth failures** as **infrastructure**: the Ky client funnels **401 Unauthorized** into a single handler so behavior stays consistent, but **not every 401 sends the user to Login**.

**In short:**

- **Centralized flow** — `wireAppHttpClient` wires auth and 401 handling; domains stay focused on APIs and UI.
- **Automatic 401 handling** — Failed requests still surface errors as today; session clearing and optional Login navigation follow **merged policies**.
- **Flexible behavior** — Public flows can **stay on screen**; protected areas can **redirect and resume** where the user left off.
- **Layered control** — App defaults, **per-screen** focus scope, and **per-request** Ky options combine; a call can opt out or override without rewriting the HTTP stack.

**Concepts to know:**

- **Policy-based** — Each 401 resolves a strategy (`no_redirect`, `back_to_previous_screen`, `login_only`, `force_specific_route`, `custom_route_function`).
- **Per-request** — Use Ky `context` via `withKyAuth401Context(...)` on specific `getApiClient()` calls.
- **Per-screen** — `useAuth401ScreenScope` applies defaults while that screen is focused.
- **Resume after login** — `pendingNavigation` (and optional custom post-login hooks) integrate with `completePendingAuthNavigation` after a successful sign-in.
- **Navigation guard** — Parallel 401s **coalesce** into a single Login navigation when redirect is enabled.

**Tiny example** (opt a call out of Login redirect):

```ts
import { withKyAuth401Context } from '@/shared/infra/auth401';

getApiClient().get(path, withKyAuth401Context({ strategy: 'no_redirect' }));
```

**Full internal spec** (architecture, strategies, file map, debugging, examples):  
→ [`src/shared/infra/auth401/AUTH401.md`](src/shared/infra/auth401/AUTH401.md)

---

## HTTP & API contracts

- **Client:** `ky` via `createAppHttpClient` in `shared/infra/http/createHttpClient.ts` (retries for GETs on 408/429/5xx; **401** responses go through the **Auth401** policy pipeline — see **Authentication & 401 Handling** above).
- **Base URL:** `resolveApiBaseUrl()` — override with `API_BASE_URL` or `REACT_NATIVE_API_URL` (default staging API is documented in project tooling; check `resolveBaseUrl.ts`).
- **Paths:** `endpoints` use **no leading slash**; the client normalizes the base URL with a single trailing `/` so paths join consistently—avoid manual `.replace(/^\//, …)` at call sites.
- **JSON:** `parseJsonResponse(request)` optionally takes a **Zod schema**; prefer schemas for **auth and other sensitive boundaries**, and expand coverage for public list endpoints over time. Legacy call sites may still use an unchecked cast when `schema` is omitted.
- **Auth token:** The access token is stored only in the **Zustand auth persist slice** (secure MMKV). `getAccessToken()` for the HTTP client reads the in-memory store first, then the persisted JSON for the same key, so the first request after cold start can still attach `Authorization` before rehydration finishes.

### Purchases (product gating)

- The **`purchases` port** (`shared/purchases`) exposes `isProductPurchased(id)`; the **user** domain registers the implementation at startup (`registerUserPurchaseLookup`).
- Purchased product IDs are loaded with **`fetchAndApplyPurchasedProductIds()`** (authenticated) when the user signs in; the store is cleared on logout. The endpoint key is **`endpoints.user.purchasedProductIds`**—**align the path and response shape** with your backend (the client tolerates several `data` shapes and fails open to an empty set on error).

---

## Shell, drawer, and errors

- **`BridgeShell`** wires theme, **`ErrorBoundary`**, `ShellDrawerProvider`, purchase registration, and **drawer user snapshot** (`ShellDrawerUserSnapshot` in `shared/contracts/shellUi.ts`) from `useAuthStore` + `useCurrentUser`, so `CustomDrawerContent` stays in `ui/` without importing domains.
- **Zustand + default MMKV** — `createStorageServiceStateStorage()` in `shared/infra/storage/createStorageServiceAdapter.ts` backs theme and language persist; **auth tokens** do not use the unencrypted default instance.

### Bootstrap (`index.js`)

- Android **layout animation** for expandable UI is enabled once at startup (`UIManager.setLayoutAnimationEnabledExperimental`), not inside leaf components.

### Multi-region (IR vs COM)

The app builds for two regions: Iran (`.ir`) and international (`.com`).

- **`isDotIr`** from `@/shared/config` — reads `REACT_NATIVE_IS_DOT_IR` env var, **inlined at compile time** by `babel-plugin-transform-inline-environment-variables`. Set before bundling.
- **`scopeHeader()`** — injects `{ Scope: 'ir' | 'com' }` on API calls that differ by region.
- Payment gateway visibility (Zarinpal, Vandar) is controlled by env vars in `src/domains/donation/model/env.ts`.

---

## Shared layer highlights (`src/shared`)

| Area | Purpose |
|------|---------|
| **`infra/http`** | `createHttpClient`, `parseJsonResponse`, `endpoints`, `ApiError`. |
| **`infra/storage`** | MMKV helpers, `zustand-mmkv-storage` (secure), `createStorageServiceStateStorage` for Zustand JSON persist. |
| **`infra/i18n`** | i18next resources, RTL helpers. |
| **`infra/query`** | Shared query keys (e.g. `AUTH_USER_QUERY_KEY`, courses, albums, …). |
| **`contracts`** | Navigation types, `ShellDrawerUiModel`, pagination, theme/locale, purchase port types. |
| **`purchases`** | In-process `isProductPurchased` indirection. |
| **`utils`** | e.g. `initialsFromDisplayName`, `resolveColorScheme`. |
| **`lib/infiniteList`** | `useAppInfiniteList`, pagination backoff + FlashList scroll helpers — see **Infinite lists architecture**. |
| **`lib/react-query`** | `useQueryCache<T>(queryKey)` — optimistic `addItem` / `removeItem` on items with numeric `id`. |
| **`infra/device`** | `useListPerformanceProfile()` — low/normal tier tuning for Android ≤ API 29 (estimatedItemSize, threshold, throttle). |
| **`ui/list-states`** | Reusable loading / error / empty / list shell for **FlashList** screens — see **List screen states** below. |
| **`ui/Swiper`** | Generic horizontal carousel on `FlatList` — `renderItem`, `itemWidth`, `gap`, `contentInsetStart` for peek, pagination dots. |

---

## List screen states (`src/shared/ui/list-states`)

Screens that load a **list** from TanStack Query should use a single pattern so UX stays consistent and **FlashList is not mounted** during loading, errors, or empty states (better performance and simpler lifecycles).

| Export | Role |
|--------|------|
| **`ListStateView`** | Orchestrates: centered loading → error + retry → empty → `SafeAreaView` + `renderList()`. |
| **`LoadingState`** | Spinner + message (used by `ListStateView` and available standalone). |
| **`ErrorState`** | Title, optional detail, primary **Retry** using theme `onPrimary`. |
| **`EmptyState`** | Title + optional subtitle. |
| **`ListFooterLoader`** | Footer `ActivityIndicator` for **infinite scroll** (`isFetchingNextPage`); wire as `ListFooterComponent`; full-screen loading must **not** use this loader. |

**Contract**

- **`renderList`** — A **stable** callback (e.g. `useCallback`) that returns a **`FlashList`** (or other list). It runs **only** in the success branch, so the list does not mount until data is ready.
- **Query wiring (typical)**  
  - **`isLoading`** (full-screen): usually **`isPending || (isError && isFetching && !isFetchingNextPage)`** — omit **`isFetchingNextPage`** so paging does not steal the overlay. For maximal scroll perf, some screens only use **`isPending`** so PTR / retries stay out of full-screen (**`Courses`**); keep inline feedback on **`ErrorState`** when you choose that shortcut.  
  - **Pull-to-refresh**: use **`isRefetching`** on infinite queries — it excludes `isFetchingNextPage`, so PTR does not confuse with paging.  
  - **Infinite scroll**: **`useInfiniteQuery`** in hooks; **`flatData`** from memoized **`pages.flatMap`**; **`onEndReached`** calls **`fetchNextPage({ cancelRefetch: false })`** when **`hasNextPage && !isFetchingNextPage`** to avoid stacking requests. Pagination logic stays in **`api/`** (`fetchCoursesPage` + **`getNextPageParam`**), not UI.  
  - **Empty**: `isSuccess && data.length === 0` — do not treat “empty” during loading.  
  - **Retry**: `refetch()` for infinite queries refreshes **all fetched pages**.  
- **i18n** — Shared label `listStates.retry`; screen-specific strings under `screens.<feature>.*` (`loading`, `error`, `empty`, …).

**Reference implementation:** [`src/domains/courses/screens/CoursesScreen.tsx`](src/domains/courses/screens/CoursesScreen.tsx) — `useInfiniteCourses` (**`useAppInfiniteList`**), `ListStateView`, memoized **`renderList`** with **`RefreshControl`**, **`ref`**, **`scrollMemoryKey`**, **`handleEndReached`**, **`ListFooterLoader`**, device-aware **`estimatedItemSize`** / thresholds.

---

## Infinite lists architecture (`src/shared/lib/infiniteList`)

**Goals:** Single TanStack **`InfiniteData`** source of truth; minimal FlashList churn; guarded pagination (no burst **`fetchNextPage`**); optional in-memory scroll restore on tab switches; no domain logic in shared code.

| Piece | Role |
|--------|------|
| **`useAppInfiniteList`** | Wraps **`useInfiniteQuery`**: memo **`flatData`** keyed on **`pages`**, **`fetchNextPage`** → mutex + **exponential backoff** (pagination only; skips **`ErrorState`** / manual **`refetch`**), **`resetInfiniteList`**, optional **`scrollMemoryKey`**. |
| **`fetchNextPageWithBackoff`** | Up to 3 attempts, 300 / 600 / 1200 ms between failures; **cancel-safe** via mounted check. |
| **`useFlashListScrollMemory`** | Blur → save offset, focus → **`scrollToOffset`**; **`restorePagingLockRef`** blocks **`onEndReached`** for **600 ms** after restore (separate from TanStack `inFlight`). |
| **`scrollMemoryStore`** | In-memory LRU (**30** keys max — evicts oldest) instead of unbounded growth. |
| **`useListPerformanceProfile`** (`shared/infra/device/`) | Android API ≤29 → lower **`onEndReachedThreshold`**, coarser **`scrollEventThrottle`**, slightly reduced **`estimatedItemSize`** factor. |

**FlashList practices used**

- **`extraData`** — omit when row components subscribe to i18n/theme via hooks (avoids list-wide invalidation on language toggles); pass `i18n.language` explicitly only when the row component needs the current language as a prop.
- **`RefreshControl`** **`useMemo`**’d; **`estimatedItemSize`** / **`onEndReachedThreshold`** / **`scrollEventThrottle`** / **`decelerationRate`** from **`useListPerformanceProfile`** (low vs normal).
- **Footer only** for next-page loading — no fake list rows, so **keys stay unique** and the query cache is untouched.

**Courses example**

1. Domain **`api/`** returns **`{ items, pagination }`** per page (`fetchCoursesPage`).
2. **`useInfiniteCourses`** calls **`useAppInfiniteList`** with **`coursesKeys.infiniteList`**, **`scrollMemoryKey`** derived from the same key JSON.
3. Screen wires **`fetchNextPage().catch(...)`** from the hook (already mutex + backoff internally), **`captureRef` / `onScroll`**, **`shouldSuppressEndReached`**, **`ListStateView`** unchanged.

```ts
import { useAppInfiniteList } from '@/shared/lib/infiniteList';

// In a domain hook — provide queryKey, page fetcher, getNextPageParam, optional scrollMemoryKey.
```

---

## UI layer (`src/ui`)

- **`theme/`** — Tokens, navigation chrome, semantic colors.
- **`components/`** — e.g. `ErrorBoundary`, `HubMenuRow`, form fields.
- **`layout/`** — `CustomDrawerContent`, `ShellDrawerContext`.

---

## Adding a new domain

1. Add `src/domains/<name>/` with `api`, `model`, `hooks`, `screens`, `ui` as needed.
2. Define types and Zod schemas in `model/`; implement fetchers in `api/` using `getApiClient()`.
3. Expose React Query (or other) hooks from `hooks/`.
4. Build `screens/` using hooks only.
5. Export a minimal surface from `index.ts` if other modules need it.
6. Register routes in `app/bridge/rootNavigator.tsx` and update `shared/contracts/navigationApp.ts` for params and route names. For protected behavior, follow existing **tab** / **drawer** listener patterns.

---

## Tech stack

| Technology | Role |
|------------|------|
| **React Native** `0.85.x` | Runtime |
| **React** `19.x` | UI |
| **TypeScript** | Typing |
| **React Navigation** `7.x` | Drawer + tabs (static config) |
| **TanStack React Query** `5.x` | Server state |
| **Zustand** | Client state (auth, theme, FAQ hub, …) with MMKV persist where used |
| **react-native-mmkv** | Fast storage (default + secure instances) |
| **ky** | HTTP on `fetch` |
| **@shopify/flash-list** | Performant lists (replaces `FlatList` for domain list screens) |
| **react-hook-form** `7.x` + **Zod** | Forms with `zodResolver`; schemas live in domain `model/` |
| **react-native-reanimated** `4.x` | Animations (collapsible headers, startup screen); plugin must be last in `babel.config.js` |
| **Reactotron** | Dev-only debugger — network, MMKV, logs (`reactotron.config.ts`) |
| **i18next** / **react-i18next** | i18n + RTL; language change triggers app reload via `react-native-restart` |
| **ESLint** + **eslint-plugin-boundaries** | Layer rules |

**Node:** `>= 22.11.0` (see `package.json` `engines`).

---

## Commands

| Command | Description |
|--------|-------------|
| `yarn` | Install dependencies |
| `yarn start` | Metro bundler |
| `yarn ios` / `yarn android` | Run on simulator / device |
| `yarn android:apk` | Android release APK |
| `yarn android:bundle` | Android App Bundle |
| `yarn lint` | ESLint (`src/`, `__tests__/`, `App.tsx`) |
| `yarn test` | Jest |
| `yarn test -- --testPathPattern=<file>` | Single test file |

---

## Coding standards (short)

- **Screens** do not call `getApiClient()` or raw `api/` imports—use domain hooks.
- **`api/`** stays async and side-effect free except HTTP (map/normalize in `model/` when possible).
- **Boundaries** — respect `eslint-plugin-boundaries`; do not make `ui` or `shared` depend on `domains`.
- **Imports** — Prefer `@/` paths (`tsconfig`).
- **List screens** — Prefer **`ListStateView`** + memoized `renderList` (see **List screen states**) instead of duplicating loading/error/empty branches per screen.

---

## License / confidentiality

This package is **private** (`"private": true` in `package.json`). Treat the repository as confidential unless your organization policy says otherwise.
