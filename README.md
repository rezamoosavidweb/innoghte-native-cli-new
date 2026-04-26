# Innoghte — React Native Client

A production-oriented React Native app built with **strict layering**, **domain-driven** folders, and **ESLint boundary rules** so features can grow in isolation with minimal cross-coupling.

---

## Overview

- **Modular layout**: Work lives in `src/domains/<domain>`; the shell (navigation, providers, cross-domain wiring) lives in `src/app`.
- **Domain boundaries**: Each domain ships `api/`, `model/`, `hooks/`, `screens/`, and often `ui/`, with small public surfaces through `index.ts` where it helps.
- **Shared vs UI**: `src/shared` holds infrastructure and contracts; `src/ui` is the design system and global layout. **`ui` does not import from `domains`**—shell data for chrome (e.g. drawer user) is passed via **`ShellDrawerContext`** from **`app/bridge/BridgeShell`**.

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

**Examples in this repo:** `auth`, `courses`, `events`, `media`, `live`, `settings`, `support` (e.g. `faqs/`), `user`, `home`, `experiences`, `search`.

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

## HTTP & API contracts

- **Client:** `ky` via `createApiTransport` / `createAppHttpClient` in `shared/infra/http` (retries for GETs on 408/429/5xx, 401 → logout hook).
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
| **Zod** | Runtime validation at JSON boundaries (expand over time) |
| **i18next** / **react-i18next** | i18n + RTL |
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

---

## License / confidentiality

This package is **private** (`"private": true` in `package.json`). Treat the repository as confidential unless your organization policy says otherwise.
