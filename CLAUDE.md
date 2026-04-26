# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start              # Start Metro bundler
yarn android            # Run on Android emulator/device
yarn ios                # Run on iOS simulator/device
yarn android:apk        # Build Android release APK
yarn android:bundle     # Build Android AAB
yarn lint               # ESLint on src/, __tests__/, App.tsx
yarn test               # Run Jest suite
yarn test -- --testPathPattern=<path>  # Run a single test file
```

Node requirement: `>= 22.11.0`. Default API base: `https://apistg.innoghte.ir` (override via `API_BASE_URL` or `REACT_NATIVE_API_URL` env var).

## Architecture

Four layers with a strict dependency direction — `app` → `domains` + `shared` + `ui`; `shared` and `ui` never import from `domains`.

```
src/
├── app/        # Bootstrap, root navigation, providers, auth bridge
├── domains/    # Feature domains (business logic + product UI)
├── shared/     # Infrastructure: HTTP, storage, i18n, navigation ref, contracts
└── ui/         # Design system: theme tokens, components, layout primitives
```

ESLint enforces layer boundaries via `eslint-plugin-boundaries` — violations are lint errors.

### Domain structure

Every feature domain follows the same template:

```
domains/<domain>/
├── api/        # Pure async fetchers and service wrappers (no React hooks)
├── model/      # Entities, DTOs, Zod schemas, Zustand stores, constants
├── hooks/      # React Query wrappers and composition hooks
├── screens/    # Route-level screens: layout + wiring only
├── ui/         # Domain-scoped components and styles
└── index.ts    # Public exports — only import domains through this file
```

### Navigation

React Navigation v7 with a static config. Root is a `DrawerNavigator`; inside the drawer is a `BottomTabNavigator` (Home, Services, Experiences, Faqs, Profile). Route types live in [src/shared/contracts/navigationApp.ts](src/shared/contracts/navigationApp.ts).

Auth-aware navigation: `protectedNavigate()` / `protectedPush()` in [src/app/bridge/auth/protectedNavigation.ts](src/app/bridge/auth/protectedNavigation.ts) store a pending intent in the auth Zustand store if unauthenticated, then resume it via `completePendingAuthNavigation()` after login.

### State management

- **Zustand + MMKV** for persisted client state (`auth.store.ts`, `uiTheme.store.ts`). Stores use `zustandMMKVStorage` adapter.
- **TanStack React Query v5** for server state. Query keys are centralized in [src/shared/infra/query/queryKeys.ts](src/shared/infra/query/queryKeys.ts).

### HTTP client

`ky`-based client created by `createApiTransport()` in [src/shared/infra/http/createHttpClient.ts](src/shared/infra/http/createHttpClient.ts). It:
- Injects `Authorization: Bearer <token>` via `beforeRequest` hook
- Calls `onUnauthorized()` and clears auth state on 401
- Retries GETs up to once on 408/429/5xx

Initialized once at app startup via `initAppHttpClient()` in [src/app/bridge/wireAppHttpClient.ts](src/app/bridge/wireAppHttpClient.ts). All API endpoints are listed in [src/shared/infra/http/endpoints.ts](src/shared/infra/http/endpoints.ts).

### Data flow

```
Screen (layout only)
  → domain hook (React Query / Zustand)
    → api fetcher (pure async)
      → getApiClient().get/post()
        → parseJsonResponse<T>()
```

Screens must not call API functions directly.

### Design system

Theme tokens (colors, typography, spacing) and semantic color resolution live in [src/ui/theme/](src/ui/theme/). Access via `useAppTheme()`. RTL is supported; direction driven by `I18nManager` and toggled per locale (default: Persian/`fa`).

### Adding a new domain

1. Create `src/domains/<name>/{api,model,hooks,screens,ui}/` folders
2. Define types/schemas in `model/`
3. Add pure async functions in `api/`
4. Add React Query hooks in `hooks/`
5. Build screens in `screens/`
6. Export public API from `index.ts`
7. Register screens in the navigator in `src/app/`
