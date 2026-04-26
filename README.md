# Innoghte — React Native Client

A production-oriented React Native application structured for **domain-driven design (DDD)**, **clear layering**, and **long-term scalability**. The codebase separates bootstrap code, feature domains, cross-cutting infrastructure, and a shared design system so teams can grow features in isolation without entangling business logic across the tree.

---

## Overview

- **Modular architecture**: Feature work lives under `src/domains/<domain>`; the shell wires navigation and providers under `src/app`.
- **Domain boundaries**: Each domain owns its API surface, state shapes, hooks, screens, and UI pieces. Cross-domain coupling is minimized; shared concerns live in `src/shared` and `src/ui`.
- **Team scale**: Predictable folder layouts, barrel exports, and import aliases reduce onboarding time and review friction.

---

## Architecture

Four primary layers compose the application:

| Layer | Role |
|--------|------|
| **`app/`** | Application bootstrap: providers, static navigation composition, startup flow, auth-aware navigation helpers. **No business rules**—only wiring and shell behavior. |
| **`domains/`** | **Business capabilities**: auth, catalog content, user-facing hubs, settings, support flows, etc. Each domain follows a consistent internal layout (see below). |
| **`shared/`** | **Framework-level infrastructure**: HTTP client, persistence, i18n, global query keys, navigation ref, purchase ports, and **contracts** (shared types—not feature UI). |
| **`ui/`** | **Design system**: theme tokens, global components, layout primitives used across domains. Domains should not reimplement spacing, typography, or chrome here. |

### High-level layout

```text
src/
├── app/                 # Bootstrap, navigation shell, providers, startup
├── domains/             # Feature domains (business + product UI)
├── shared/              # Infra, contracts, cross-cutting utilities
└── ui/                  # Global design system (theme, components, layout)
```

**Dependency direction (intended):** `app` → `domains` + `shared` + `ui`; `domains` → `shared` + `ui`; `shared` and `ui` do not depend on `domains`.

---

## Domain structure

Each domain under `src/domains/<name>/` follows a **standard template**:

```text
domains/<domain>/
├── api/           # HTTP calls, fetchers, thin service wrappers (no React hooks)
├── model/         # Entities, DTOs, Zod schemas, stores, domain constants
├── hooks/         # React Query, composition, domain-specific hook logic
├── screens/       # Route-level screens: layout + wiring to hooks (no direct HTTP)
├── ui/            # Domain-scoped components, cards, forms, styles
├── index.ts       # Public exports for the domain (optional but recommended)
```

### Responsibilities

- **`api/`** — Network I/O only. Call sites return data or throw; no UI, no `useQuery` / `useMutation`.
- **`model/`** — Types, mapping from API payloads, validation schemas, Zustand slices that belong to this domain.
- **`hooks/`** — TanStack Query usage, derived state, orchestration consumed by screens and domain UI.
- **`screens/`** — Page components: connect hooks to presentational pieces. **Do not import `getApiClient()` or raw fetchers here.**
- **`ui/`** — Reusable pieces **within** the domain (e.g. list cards, forms). Shared visual primitives stay in `src/ui`.

Some domains include **sub-areas** (e.g. `support/faqs/`) when a subdomain is large enough to own its own `api` / `model` / `hooks` / `screens` / `ui`. The **root** `support/` folder may carry placeholder modules so top-level structure stays consistent as features grow.

**Example domains in this repo:** `auth`, `courses`, `events`, `media`, `live`, `settings`, `support`, `user`, `search`, `home` (includes the Services tab hub screen), `experiences`.

---

## Data flow

Intended flow for server-backed features:

```text
Screen  →  hook (e.g. React Query)  →  api/ fetcher  →  HTTP  →  backend
                ↓
            model / cache
                ↓
Screen + domain ui  ←  typed data + loading/error state
```

- **Screens** subscribe to hooks and render **domain `ui/`** components.
- **Hooks** own caching, retries, and mutation side effects (invalidation, optimistic updates where applicable).
- **`api/`** remains easy to test and mock: pure async functions over the shared HTTP layer.

Auth-gated navigation (e.g. redirect to login and resume intent) is coordinated from **`app/bridge/auth`** together with the auth store in **`domains/auth/model`**.

---

## Shared layer (`src/shared`)

| Area | Purpose |
|------|---------|
| **`infra/http`** | HTTP client (`ky`-based), base URL resolution, parsing helpers, errors. |
| **`infra/storage`** | MMKV-backed storage helpers; Zustand persistence adapters where used. |
| **`infra/i18n`** | i18next resources and RTL/locale helpers. |
| **`infra/query`** | Shared **query key factories** to avoid cache collisions across domains. |
| **`infra/navigation`** | `navigationRef` and other navigation infrastructure. |
| **`contracts`** | Route param types, pagination shapes, and other **cross-domain TypeScript contracts**. |
| **`purchases`** | Abstraction for “is this product purchased?”—domains consume the port, not store shape. |
| **`utils`** | Small, framework-agnostic helpers. |

Keep **`shared`** free of feature-specific screens or product copy. If it’s only used by one domain, it usually belongs in that domain.

---

## UI system (`src/ui`)

- **`theme/`** — Design tokens: color scales, spacing, typography, navigation chrome, semantic helpers (e.g. light/dark).
- **`components/`** — Reusable building blocks (e.g. scaffold, form fields, chrome buttons).
- **`layout/`** — Shell layout (drawer content, context providers for shell UI).

Domains import tokens and primitives from `@/ui/...` instead of hard-coding raw values where possible.

---

## Adding a new domain

1. **Create** `src/domains/<myDomain>/` with folders: `api`, `model`, `hooks`, `screens`, `ui` (use `export {}` or a short comment in `index.ts` files until real code exists).
2. **Define** types and schemas in `model/`; add fetchers in `api/` using the shared HTTP client.
3. **Add** `hooks/use<MyFeature>.ts` (or several hooks) that call `api/` via TanStack Query or local state as needed.
4. **Implement** `screens/<MyScreen>.tsx` that uses hooks only—no direct `api/` calls from the screen file.
5. **Place** reusable domain widgets in `ui/` (cards, forms, local styles).
6. **Export** public entry points from `domains/<myDomain>/index.ts` (screens, hooks, types you want other layers to use—keep the surface small).
7. **Register** the screen in `src/app/bridge/rootNavigator.tsx` (or the appropriate navigator module) and extend `shared/contracts/navigationApp` if new route names or params are introduced.

---

## Tech stack

| Technology | Usage |
|------------|--------|
| **React Native** `0.85.x` | Application runtime |
| **React** `19.x` | UI |
| **TypeScript** | Strict typing across layers |
| **React Navigation** `7.x` | Drawer + tabs + stack-style composition |
| **TanStack React Query** `5.x` | Server state, caching, mutations |
| **Zustand** | Client state (e.g. auth, settings) |
| **react-native-mmkv** | Fast key-value persistence |
| **ky** | HTTP client built on `fetch` |
| **Zod** | Runtime validation / schemas (where used) |
| **react-hook-form** + **@hookform/resolvers** | Form state in complex flows |
| **i18next** / **react-i18next** | Localization |
| **Jest** | Unit tests |
| **ESLint** (+ import/boundary rules) | Linting and layer discipline |

**Node:** `>= 22.11.0` (see `package.json` `engines`).

---

## Coding standards

- **No API calls in screens** — Screens call hooks; hooks call `api/`.
- **Hooks own React-facing logic** — Query keys, `enabled` flags, mutations, and composition live next to the domain.
- **`api/` stays pure** — No `useState`, no navigation, no i18n side effects unless unavoidable at the transport edge (prefer mapping in `model/`).
- **`shared` is not a dumping ground** — Only truly cross-cutting or multi-domain code.
- **Imports** — Prefer the `@/` alias (`tsconfig` paths) for `src/*`.
- **Naming** — Hooks: `useXxx.ts`; screens/components: `PascalCase`; domain folders: lowercase or consistent camelCase per existing domains.

---

## Philosophy

- **Modularity** — Domains are the unit of change; shrinking blast radius is a design goal.
- **Scalability** — New product areas add a folder and exports, not a rewrite of global state.
- **Separation of concerns** — Transport, state, presentation, and shell wiring have distinct homes.
- **Feature isolation** — Avoid deep imports across domains; expose minimal public APIs via `index.ts` where practical.

---

## Getting started

### Prerequisites

- Node.js **≥ 22.11.0**
- Yarn or npm (lockfile: `yarn.lock`)
- Xcode (iOS) / Android SDK (Android) per React Native docs

### Install

```bash
yarn install
# or: npm install
```

### Run Metro

```bash
yarn start
```

### Run on device / simulator

```bash
yarn ios
# or
yarn android
```

### Lint & test

```bash
yarn lint
yarn test
```

---

## License / confidentiality

This repository is **private** (`"private": true` in `package.json`). Treat source and configuration as confidential unless your organization states otherwise.
