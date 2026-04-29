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
| **domains** | `src/domains/` | Feature modules: `auth`, `courses`, `events`, `experiences`, `home`, `live`, `media`, `search`, `settings`, `support`, `user` |
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
- **Main content:** Bottom tab navigator with 5 tabs (`Home`, `PublicCourses`, `PublicAlbums`, `Faqs`, `Profile`)
- **Drawer routes:** Secondary screens (Settings, Account, MyCourses, LiveMeetings, Events, etc.)

Navigation types (`TabParamList`, `DrawerParamList`) are in [src/shared/contracts/navigationApp.ts](src/shared/contracts/navigationApp.ts).

**Auth-gated routes** use `protectedNavigate()` / `protectedPush()` — these queue an intent in the auth store. After login, `completePendingAuthNavigation()` replays the queued destination. Parallel 401 responses coalesce into a single Login navigation via the centralized 401 handler in `src/shared/infra/auth401/`.

Global imperative navigation uses `navigationRef` from `src/shared/infra/navigation/navigationRef.ts`.

## State Management

**Zustand v5** for global/persistent state, **TanStack Query v5** for server state.

Key Zustand stores:
- `useAuthStore` — `isAuthenticated`, `accessToken`, `pendingNavigation`; persisted to secure MMKV; only `isAuthenticated` and `accessToken` are serialized
- `useUiThemeStore` — `preference: 'light' | 'dark' | 'system'`; persisted to default MMKV

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

## Bootstrap Order

1. `index.js` — RTL, i18n init, register App
2. `src/app/App.tsx` — imports `wireAppHttpClient` (side-effect), wraps with `RootProviders`
3. `RootProviders` — i18next, QueryClient, SafeAreaProvider, BridgeShell
4. `BridgeShell` — ErrorBoundary, AppThemeProvider, StatusBarChrome, auth+theme wiring

## Key Shared Utilities

- **`src/shared/lib/infiniteList/`** — `useAppInfiniteList`: wraps `useInfiniteQuery` with memoized `flatData`, scroll-offset memory (LRU 30 keys), pagination backoff (300/600/1200 ms)
- **`src/shared/ui/list-states/`** — `ListStateView`, `LoadingState`, `ErrorState`, `EmptyState`, `ListFooterLoader` — use these for all list screens instead of per-screen duplicates
- **`src/shared/infra/auth401/`** — per-request policy via `withKyAuth401Context(...)`, per-screen scope via `useAuth401ScreenScope`

## Path Aliases

`@/*` maps to `src/*` (configured in `tsconfig.json`, `babel.config.js`, and Jest). Always use `@/` imports rather than relative parent paths.

## SVG Icons

SVGs in `src/assets/icons/` are compiled to React components by `react-native-svg-transformer` (configured in `metro.config.js`). Import directly: `import VerifyIcon from '@/assets/icons/verify.svg'`.
