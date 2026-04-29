# Auth401 — Internal documentation

> **Location:** `src/shared/infra/auth401/` (11 TypeScript modules + this file)  
> **Related wiring:** `app/bridge/wireAppHttpClient.ts`, `shared/infra/http/createHttpClient.ts`, `app/bridge/auth/protectedNavigation.ts`, `domains/auth/*`

This document explains the **Auth401** subsystem: policy-driven handling of HTTP **401 Unauthorized** responses from the Ky client through navigation and post-login resume—without forcing a single global “always redirect to Login” behavior.

---

## 🚀 Quick Start

Copy-paste defaults; tweak only when product needs something different.

### Protected screen (redirect + resume after login)

```tsx
import { useMemo } from 'react';
import { useAuth401ScreenScope } from '@/shared/infra/auth401';

const policy = useMemo(
  () => ({
    strategy: 'back_to_previous_screen' as const,
    redirectToLogin: true,
  }),
  [],
);
// Inside your screen component:
useAuth401ScreenScope(policy);
```

### Public API (stay on page — no trip to Login)

```ts
import { getApiClient } from '@/shared/infra/http';
import { withKyAuth401Context } from '@/shared/infra/auth401';

await getApiClient().get(path, withKyAuth401Context({ strategy: 'no_redirect' }));
```

### TanStack Query (bridge `meta` → Ky)

```ts
import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@/shared/infra/http';
import {
  withKyAuth401Context,
  type Auth401PolicyInput,
} from '@/shared/infra/auth401';

useQuery({
  queryKey: ['myResource'],
  meta: {
    auth401: { strategy: 'back_to_previous_screen', redirectToLogin: true },
  },
  queryFn: async ({ meta }) => {
    const policy = (meta as { auth401?: Auth401PolicyInput }).auth401 ?? {};
    return getApiClient().get(path, withKyAuth401Context(policy));
  },
});
```

For “public” queries, use `meta: { auth401: { strategy: 'no_redirect' } }` (or rely on app defaults + screen scope).

---

## 📊 Decision table (choose a strategy fast)

Use this table to pick a **strategy** from product intent. Final behavior still merges **global → focused screen → per-request** Ky `context.auth401` (request wins per field).

| Scenario | Strategy | What the user experiences |
|----------|----------|----------------------------|
| Public / guest API — 401 should not hijack the flow | `no_redirect` | Session cleared; **stays** on current screen; error via `onApiError` / query error (no Login push). |
| Protected screen — return where they were | `back_to_previous_screen` | **Login** → after success, **resume** captured route (or Home if nothing captured). |
| “Sign in again” — no deep resume | `login_only` | **Login** → after success, **Home** unless something else set `pendingNavigation`. |
| Post-login must land on one known place (e.g. hub) | `force_specific_route` + `forcedTarget` | **Login** → navigate to **specific** screen you encoded in `forcedTarget`. |
| Background / polling — don’t rip user to Login | `no_redirect` (usually) | **No** Login navigation; stop polling or show inline error when session is dead. |
| Background / sync — must force re-auth, no resume | `login_only` | **Login** → **Home** (or other pending only if another flow set it). |
| One-off navigation / legacy flow | `custom_route_function` + `customPostLogin` | **Login** → your callback runs **first** in `completePendingAuthNavigation` (you own navigation if you replace default resume). |

**Defaults:** App-wide baseline is conservative (`no_redirect`, no Login navigation) until you change `setGlobalAuth401Defaults` in bootstrap — see the **`globalDefaults.ts`** / **Global defaults** sections below.

---

## 🧩 Visual flow (one glance)

`401` → **ky `beforeError`** → **`handleKy401Unauthorized`** → **merge policy** (`global` + **screen** + **request**) → **strategy** (pending / custom queue / session clear) → **`safeNavigateToLoginFrom401`** (**guard**: one navigate, skip if already Login) → **Login** → **`completePendingAuthNavigation`** → **resume** (custom handler or `pendingNavigation` or **Home**)

---

## 1. High-level overview

### 1.1 What problem Auth401 solves

Mobile apps often hit APIs that return **401** when a token is missing, expired, or rejected. Naive handling causes poor UX:

- Kicking the user to Login on **every** 401 (including **public** endpoints) is wrong.
- **Ignoring** 401 leaves the UI thinking the user is signed in when the session is dead.
- **Parallel requests** failing together can fire **multiple** `navigate('Login')` calls, duplicating stack entries and causing flicker.

Auth401 provides a **single entry point** (`handleKy401Unauthorized`) that:

1. **Clears the session** appropriately (without always wiping post-login navigation intent).
2. Optionally **navigates to Login** once (guarded).
3. Optionally **records where to return** after login (`pendingNavigation` or a custom callback).

### 1.2 Why “redirect on 401” globally is not enough

| Concern | Why a global redirect fails |
|--------|------------------------------|
| Public vs protected APIs | A catalog or FAQ call may 401 for tracing reasons but should **not** send guests to Login. |
| Different products / flows | Checkout vs settings vs media may need **different** resume targets. |
| UX control | Sometimes you only want to **clear the session** and show an inline error (`onApiError`), not change screens. |
| Performance / stability | Multiple simultaneous 401s must **coalesce** into one navigation action. |

### 1.3 Key features

| Feature | Description |
|--------|-------------|
| **Policy-based control** | Each 401 path resolves a `ResolvedAuth401Policy` from **defaults + focused screen + ky request context**. |
| **Per-request behavior** | Pass policy via Ky’s `context.auth401` using `withKyAuth401Context`. |
| **Per-screen behavior** | `useAuth401ScreenScope` pushes a policy while the screen is focused (LIFO stack, no React context). |
| **Redirect strategies** | `no_redirect`, `login_only`, `back_to_previous_screen`, `force_specific_route`, `custom_route_function`. |
| **Login resume** | Uses `AuthService`’s `pendingNavigation` (and optional `customPostLogin`) consumed in `completePendingAuthNavigation` after successful login. |
| **Navigation guard** | `loginNavigationGuard` ensures **at most one** coalesced `navigate('Login')` for a burst of 401s; skips if already on Login; handles `navigationRef` not-ready. |

---

## 2. Architecture diagram (text-based)

End-to-end flow:

```
HTTP 401 from API
       │
       ▼
ky `beforeError` hook (`createHttpClient.ts`)
  • builds ApiError, calls `onApiError`
  • if status === 401 → `onUnauthorized({ kyContext: state.options.context })`
       │
       ▼
`handleKy401Unauthorized` (`handleKy401.ts`)
  • read `readAuth401FromKyContext(detail.kyContext)`  ← per-request policy
  • `resolveAuth401Policy(global, screenScope, request)`  ← merged policy
  • `applyResolved401Policy(resolved)`  ← session + pending + optional queue
       │
       ├── strategy branches ─────────────────────────────────────┐
       │   • set/clear `pendingNavigation` via `AuthService`       │
       │   • optionally `queue401PostLogin(customPostLogin)`       │
       │   • `clearSessionTokensOnly()` (keeps pending unless     │
       │      strategy changed it)                                 │
       │   • if `redirectToLogin` → `safeNavigateToLoginFrom401` │
       ▼                                                           │
`loginNavigationGuard` (`loginNavigationGuard.ts`)                │
  • coalesces parallel navigations; defers if ref not ready       │
       │                                                           │
       ▼                                                           │
React Navigation: user on Login screen                            │
       │                                                           │
       ▼                                                           │
Successful login (`auth.service` → `setAuth`)                     │
  • `resetAuth401LoginNavigationGuard()`                          │
       │                                                           │
       ▼                                                           │
`LoginScreen` → `completePendingAuthNavigation` (`protectedNavigation.ts`)
  • `take401PostLoginHandler()` — if set, run **custom** and return
  • else `consumePendingNavigation()` → `navigateToAppLeaf` or Home
```

**Mental checkpoint:** Policy runs **for every 401**; **navigation to Login** is funneled through **one guarded function**.

---

## 3. File-by-file reference

> **Note:** The `auth401` package currently contains **11** TypeScript modules. Integration with Ky and auth lives in a few files outside this folder (listed under each file where relevant).

### 📄 `types.ts`

**Purpose:** Single source of truth for Auth401 **policy shapes** and **strategy union**.

**Responsibility:**

- Defines `Auth401RedirectStrategy`, `Auth401PolicyInput` (partial layers), and `ResolvedAuth401Policy` (fully merged view).
- Documents which strategies need `forcedTarget` or `customPostLogin`.

**Used by:** `resolvePolicy.ts`, `kyContext.ts`, `globalDefaults.ts`, `screenScope.ts`, `useAuth401ScreenScope.ts`, `handleKy401.ts`.

**Key types:**

- `Auth401PolicyInput` — fields you can set on global / screen / request layers.
- `ResolvedAuth401Policy` — after merge; always has concrete `redirectToLogin` and `strategy`.

**When you should care:** Adding a **new strategy** or a new policy field (e.g. future refresh-token behavior). Start here, then `resolvePolicy` + `handleKy401`.

---

### 📄 `resolvePolicy.ts`

**Purpose:** **Pure** merge of three policy layers into one resolved policy (easy to unit test).

**Responsibility:**

- For each field (`strategy`, `redirectToLogin`, `forcedTarget`, `customPostLogin`), picks the first defined value in order: **request → screen → global** (see `pickDefined`).
- Enforces: `strategy === 'no_redirect'` ⇒ `redirectToLogin === false`.

**Used by:** `handleKy401.ts` (only production call site).

**Key functions:**

- `resolveAuth401Policy(globalLayer, screenLayer, requestLayer)`

**When you should care:** Changing **precedence rules**, defaults for `redirectToLogin` when omitted, or adding validation (e.g. require `forcedTarget` when strategy is `force_specific_route`).

---

### 📄 `screenScope.ts`

**Purpose:** **Per-screen** default policy without React Context (avoids tree-wide re-renders).

**Responsibility:**

- Maintains a **LIFO stack** of `Auth401PolicyInput` objects.
- `pushAuth401ScreenPolicy` returns a **cleanup** function (used by `useFocusEffect`).
- `getFocusedAuth401ScreenPolicy` returns the **top** of the stack (innermost focused screen).

**Used by:** `useAuth401ScreenScope.ts`, `handleKy401.ts`.

**Key functions:**

- `pushAuth401ScreenPolicy(policy): () => void`
- `getFocusedAuth401ScreenPolicy(): Auth401PolicyInput | undefined`

**When you should care:** Debugging “wrong screen won” policies (nested stacks / focus order), or extending scope (e.g. modal overlays)—keep LIFO semantics documented.

---

### 📄 `useAuth401ScreenScope.ts`

**Purpose:** React Navigation–friendly hook for screen-level defaults.

**Responsibility:**

- On focus: pushes `policy` onto `screenScope` stack.
- On blur/unfocus: pops via cleanup from `useFocusEffect`.

**Used by:** Feature screens (import from `@/shared/infra/auth401`).

**Key functions:**

- `useAuth401ScreenScope(policy: Auth401PolicyInput)`

**When you should care:** Applying **default 401 behavior for everything fired while this screen is visible**. Use **`useMemo`** for a stable `policy` object when possible to avoid unnecessary push/pop churn.

---

### 📄 `kyContext.ts`

**Purpose:** Bridge **Ky `context`** (official ky feature) to Auth401 **per-request** policy.

**Responsibility:**

- Defines `AUTH401_KY_CONTEXT_KEY` (`'auth401'`) under `options.context`.
- `withKyAuth401Context` merges a policy into ky options **shallowly** at the `context` level.
- `readAuth401FromKyContext` extracts the policy inside `handleKy401`.

**Used by:** API modules, `handleKy401.ts`.

**Key symbols / functions:**

- `AUTH401_KY_CONTEXT_KEY`
- `withKyAuth401Context(policy, base?)`
- `readAuth401FromKyContext(context)`

**When you should care:** Every place you need **this call** to behave differently on 401 than the rest of the screen (e.g. silent refresh vs hard redirect).

---

### 📄 `captureRoute.ts`

**Purpose:** Read **focused leaf route** from `navigationRef` for **resume snapshots** and guard helpers.

**Responsibility:**

- Walks React Navigation state to the deepest focused route (`focusedLeafRoute`—internal).
- `getFocusedLeafRouteFromNavigationRef` — raw leaf `name` + `params`.
- `isOnLoginScreen` — leaf name is `'Login'`.
- `captureResumeRouteFromNavigationRef` — returns `PendingNavigation | null`, skipping `Login` and `Startup`.

**Used by:** `handleKy401.ts`, `loginNavigationGuard.ts`, re-exported from `index.ts`.

**Key functions:**

- `getFocusedLeafRouteFromNavigationRef()`
- `isOnLoginScreen()`
- `captureResumeRouteFromNavigationRef()`

**When you should care:** Adjusting **which routes are not serializable** as resume targets (edit `SKIP_RESUME_ROUTE_NAMES`), or fixing deep linking / nested navigator edge cases in the walker.

---

### 📄 `post401LoginQueue.ts`

**Purpose:** **Single-slot** queue for **custom post-login** behavior triggered by Auth401 (not persisted).

**Responsibility:**

- `queue401PostLogin(fn)` stores **one** callback (last writer wins).
- `take401PostLoginHandler` **consumes** and clears it (used after login).
- `peek401PostLoginQueued` exposes whether something is queued (debug/tests).

**Used by:** `handleKy401.ts`, `app/bridge/auth/protectedNavigation.ts` (`completePendingAuthNavigation`).

**Key functions:**

- `queue401PostLogin(handler)`
- `take401PostLoginHandler()`
- `peek401PostLoginQueued()`

**When you should care:** Changing **order** relative to `consumePendingNavigation` (today: **custom runs first** and is expected to handle navigation itself if it replaces default resume).

---

### 📄 `globalDefaults.ts`

**Purpose:** **App-wide** fallback policy when neither screen nor request specifies behavior.

**Responsibility:**

- Holds mutable `globalAuth401Defaults` (initially: `no_redirect`, `redirectToLogin: false`—session clear via handler without Login navigation, matching conservative legacy behavior).
- `setGlobalAuth401Defaults` / `getGlobalAuth401Defaults`.

**Used by:** `handleKy401.ts`, `wireAppHttpClient.ts` (optional commented example).

**Key functions:**

- `setGlobalAuth401Defaults(next)`
- `getGlobalAuth401Defaults()`

**When you should care:** Product decision: “**most** API calls should redirect + resume”—set stronger defaults here once, then opt **out** per request with `withKyAuth401Context({ strategy: 'no_redirect' })`.

---

### 📄 `loginNavigationGuard.ts`

**Purpose:** **Coalesce** Auth401-driven Login navigations and harden edge cases.

**Responsibility:**

- `safeNavigateToLoginFrom401` — the only path `handleKy401` uses to open Login.
- `auth401LoginNavigationInFlight` latch blocks duplicate `navigate` while a transition is pending.
- If `navigationRef` not ready: **one** `state` listener defers navigation (`scheduleNavigateToLoginWhenNavReady`).
- If `getAccessToken()` is truthy (e.g. race: user logged in before deferred nav): **abort** and `resetAuth401LoginNavigationGuard`.
- `attachLoginArrivalLatch`: clears in-flight latch once Login is **focused** (so a guest who leaves Login can get a future 401 redirect).
- `resetAuth401LoginNavigationGuard` clears latch + all listeners.

**Used by:** `handleKy401.ts`, `domains/auth/api/auth.service.ts`, `domains/auth/services/authService.ts`.

**Key functions:**

- `safeNavigateToLoginFrom401()`
- `resetAuth401LoginNavigationGuard()`

**When you should care:** Investigating **duplicate Login routes**, **stuck** redirects, or races with **`navigationRef` readiness**. Not exported from `index.ts`—treat as **internal** to Auth401 + auth lifecycle.

---

### 📄 `handleKy401.ts`

**Purpose:** **Central orchestrator** for 401: merge policy → mutate session/navigation intent → optional Login navigation.

**Responsibility:**

- `handleKy401Unauthorized(detail)` — public entry from HTTP wiring.
- `applyResolved401Policy` — strategy switch:
  - **Custom strategy:** queues `customPostLogin`, clears session, maybe navigates (via guard), **returns early** (does not also run the generic `switch`).
  - **Other strategies:** update `pendingNavigation` as needed, **always** `clearSessionTokensOnly()`, then maybe `safeNavigateToLoginFrom401()`.

**Used by:** `app/bridge/wireAppHttpClient.ts` (via barrel `handleKy401Unauthorized`).

**Key functions:**

- `handleKy401Unauthorized(detail: Ky401UnauthorizedDetail)`

**When you should care:** Any change to **what** happens on 401 besides navigation (e.g. telemetry, refresh token retry). Keep **navigation** inside `safeNavigateToLoginFrom401`.

---

### 📄 `index.ts`

**Purpose:** **Public barrel** for feature code (`@/shared/infra/auth401`).

**Responsibility:**

- Re-exports types, policy merge, ky helpers, hook, defaults, handler, post-login queue utilities, route helpers.
- Contains **usage examples** in a top-of-file doc comment.

**Used by:** App bridge, domains, features.

**Note:** **`loginNavigationGuard`** is intentionally **not** re-exported here—consumers should not navigate to Login for 401 outside `handleKy401` except via normal product navigation.

**When you should care:** Deciding whether a new helper is **public** (add here) or **internal** (omit).

---

### 📄 `AUTH401.md`

**Purpose:** This internal specification for engineers.

**Responsibility:** Human-readable map of the system.

**Used by:** Developers onboarding to the codebase.

---

### Related files (outside `auth401/` but part of the story)

| File | Purpose |
|------|---------|
| `shared/infra/http/createHttpClient.ts` | Ky `beforeError`; passes `kyContext` into `onUnauthorized`. |
| `app/bridge/wireAppHttpClient.ts` | Wires `onUnauthorized: handleKy401Unauthorized`. |
| `domains/auth/model/auth.store.ts` | `pendingNavigation`, `clearSessionTokensOnly` vs full `logout`. |
| `domains/auth/api/auth.service.ts` | On login success / logout, resets login navigation guard. |
| `domains/auth/services/authService.ts` | `clearLocalAuth` also resets guard. |
| `app/bridge/auth/protectedNavigation.ts` | `completePendingAuthNavigation` runs custom handler then pending consume. |

---

## 4. How everything connects

| Layer | Role |
|-------|------|
| **Ky** | Supplies `state.options.context` on every request; Auth401 reads `context.auth401`. |
| **`resolveAuth401Policy`** | Merges **global + focused screen + request** into one decision. |
| **`navigationRef`** | Source of truth for **where the user is** when capturing resume targets; guard uses it for readiness + focus. |
| **`AuthService` store** | `clearSessionTokensOnly` clears tokens without deleting `pendingNavigation` first; strategies set pending **before** session clear inside `applyResolved401Policy`. |
| **`post401LoginQueue`** | Holds at most one **custom** post-login callback; drained before `consumePendingNavigation`. |
| **`loginNavigationGuard`** | Ensures Login navigation from 401 is **idempotent** under parallel failures. |

---

## 5. Usage examples (detailed)

### A. Simple API — **no** Login redirect (session still cleared on 401)

Global defaults already behave like “no redirect” for navigation; you can still make the call explicit:

```ts
import { getApiClient } from '@/shared/infra/http';
import { withKyAuth401Context } from '@/shared/infra/auth401';

await getApiClient().get(
  path,
  withKyAuth401Context({ strategy: 'no_redirect' }),
);
```

Errors still surface via existing **`onApiError`** / TanStack error boundaries as today.

---

### B. Protected screen — **auto** policy for all requests while focused

```tsx
import { useMemo } from 'react';
import { useAuth401ScreenScope } from '@/shared/infra/auth401';

const policy = useMemo(
  () => ({
    strategy: 'back_to_previous_screen' as const,
    redirectToLogin: true,
  }),
  [],
);

export function MyProtectedScreen() {
  useAuth401ScreenScope(policy);
  // ...
}
```

Any API call **without** its own `context.auth401` inherits this while the screen is focused.

---

### C. TanStack Query integration

TanStack does not pass `meta` into Ky automatically—you **bridge** in `queryFn`.

#### C.1 Disable redirect for a query

```ts
useQuery({
  queryKey: ['publicThing'],
  meta: { auth401: { strategy: 'no_redirect' } },
  queryFn: async ({ meta }) => {
    const policy = (meta as { auth401?: Auth401PolicyInput }).auth401 ?? {};
    return getApiClient().get(path, withKyAuth401Context(policy));
  },
});
```

#### C.2 Enable redirect + resume

```ts
useQuery({
  queryKey: ['privateThing'],
  meta: {
    auth401: { strategy: 'back_to_previous_screen', redirectToLogin: true },
  },
  queryFn: async ({ meta }) => {
    const policy = (meta as { auth401?: Auth401PolicyInput }).auth401 ?? {};
    return getApiClient().get(path, withKyAuth401Context(policy));
  },
});
```

#### C.3 Custom post-login (see section E)

Pass `strategy: 'custom_route_function'` and a **`customPostLogin`** function in the policy object passed to `withKyAuth401Context` (closures allowed; not serialized).

---

### D. Force redirect to a **specific** screen after login

Use **`force_specific_route`** + `forcedTarget` matching your `PendingNavigation` shape (`name` + optional `params`):

```ts
getApiClient().get(
  path,
  withKyAuth401Context({
    strategy: 'force_specific_route',
    redirectToLogin: true,
    forcedTarget: { name: 'MyCourses' },
  }),
);
```

Ensure `name` is compatible with `navigateToAppLeaf` / your navigator config.

---

### E. Custom post-login logic

```ts
getApiClient().get(
  path,
  withKyAuth401Context({
    strategy: 'custom_route_function',
    redirectToLogin: true,
    customPostLogin: () => {
      // Runs in completePendingAuthNavigation BEFORE default pending consume.
      // You own navigation if you replace the default flow (call navigateToAppLeaf / etc.).
    },
  }),
);
```

**Caution:** Misuse can **skip** `consumePendingNavigation`—see `protectedNavigation.ts` for execution order.

---

## 6. Strategies explained

| Strategy | `redirectToLogin` default | Session (`clearSessionTokensOnly`) | Pending / resume | Typical use |
|----------|----------------------------|-----------------------------------|------------------|-------------|
| **`no_redirect`** | **false** (forced) | Cleared | Unchanged unless another branch set it | Public endpoints; stay on screen, show error. |
| **`login_only`** | **true** (if not overridden) | Cleared | **`setPendingNavigation(null)`** for this flow | “Sign in again” without remembering deep link. |
| **`back_to_previous_screen`** | **true** | Cleared | Capture **focused leaf** (not `Login`/`Startup`) | Return user to the screen that triggered the protected API. |
| **`force_specific_route`** | **true** | Cleared | Sets **`forcedTarget`** | Always land on a known app section after re-auth. |
| **`custom_route_function`** | **true** (if not overridden) | Cleared | **`queue401PostLogin`**; **does not** run the generic `switch` | Integrate with legacy flows, analytics, one-off navigation. |

**Internal flow (shared):** Almost all paths call `AuthService.clearSessionTokensOnly()`; **Login navigation** goes through `safeNavigateToLoginFrom401` when `redirectToLogin` is true.

---

## 7. Guard system

### 7.1 Why multiple 401s are dangerous

If five requests fail together, five `navigationRef.navigate('Login')` calls may:

- Stack duplicate routes or drawer states.
- Fight ongoing transitions (flicker).
- Race with `pendingNavigation` writes.

### 7.2 How the guard works

- **`auth401LoginNavigationInFlight`:** After the first successful `navigate('Login')` dispatch, **subsequent** calls return early until Login is focused (arrival latch clears in-flight) or **`resetAuth401LoginNavigationGuard`** runs.
- **`isOnLoginScreen()`:** If Login is already focused, **no** redundant navigate.
- **`navigationRef` not ready:** At most **one** deferred `state` listener tries again via `safeNavigateToLoginFrom401`.
- **`getAccessToken()` truthy:** User re-authenticated before deferred navigation; guard **resets** and returns (no stray Login push).

### 7.3 When it resets

| Event | Where |
|-------|-------|
| Successful login (`setAuth`) | `domains/auth/api/auth.service.ts` |
| Logout API flow completes | `auth.service.ts` `finally` |
| `AuthService.clearLocalAuth()` | `domains/auth/services/authService.ts` |
| Token present during guarded navigate | `safeNavigateToLoginFrom401` |

### 7.4 Why it’s safe / scalable

- **No React Context** → no extra subtree re-renders.
- **Policy logic still runs per 401**; only **navigation** is coalesced (pending updates from parallel 401s may still “last write wins”—prefer explicit per-request policies for critical calls).
- **Listeners** are torn down on **reset** to avoid leaks.

---

## 8. Best practices

1. **Prefer explicit per-request policy** for calls whose 401 meaning differs from the screen default (silent vs hard logout).
2. **Use `useMemo`** for screen scope policy objects.
3. **Avoid heavy work** in `customPostLogin`; keep it synchronous navigation / dispatch. Async work should enqueue app-specific side effects with clear ownership.
4. **Don’t call `navigate('Login')` manually** for 401 in random features—use policies so **pending + guard** stay consistent.
5. **Don’t weaken `no_redirect` globally** unless product truly wants most calls to kick users to Login; start with **opt-in** redirect on sensitive modules.

---

## 9. Common scenarios

| Scenario | Suggested setup |
|---------|-------------------|
| **Public pages** | Global `no_redirect` + per-request `no_redirect` on mixed endpoints if needed. |
| **Protected pages** | `useAuth401ScreenScope({ strategy: 'back_to_previous_screen', redirectToLogin: true })`. |
| **Background APIs** (polling) | Explicit `no_redirect` + handle 401 in service layer / disable polling when logged out. |
| **Onboarding / forced destinations** | `force_specific_route` or `login_only` to avoid storing arbitrary resume snapshots. |

---

## 10. Debugging guide

| Symptom | Likely cause | Where to look |
|---------|--------------|---------------|
| **No redirect** | Policy resolved to `no_redirect` or `redirectToLogin: false` | Log merged policy in `handleKy401Unauthorized` (temporary) or inspect ky `context.auth401`. |
| **Unexpected redirect** | Screen scope or global default stronger than you thought | `getFocusedAuth401ScreenPolicy()`, `getGlobalAuth401Defaults()`, order of `useAuth401ScreenScope`. |
| **Wrong resume target** | `captureResumeRouteFromNavigationRef` leaf not what you expect | Navigation state shape, `SKIP_RESUME_ROUTE_NAMES`. |
| **Custom handler didn’t run** | Not `custom_route_function` strategy or login didn’t call `completePendingAuthNavigation` | `LoginScreen`, `post401LoginQueue`. |
| **Duplicate Login** (rare after guard) | Non-401 code paths calling `navigate('Login')` | `BridgeShell`, `protectedNavigation.dispatchLogin`. |
| **Stuck “can’t redirect again”** | Guard not reset after auth edge case | Ensure login/logout/`clearLocalAuth` paths call `resetAuth401LoginNavigationGuard`. |

**Suggested temporary logging point:** start of `handleKy401Unauthorized` with merged `ResolvedAuth401Policy` and `detail.kyContext`. Remove before shipping.

---

## 11. Mental model

> **Every HTTP request can attach (via Ky `context`) its own answer to: “If this call returns 401, what should we do about session, resume, and Login navigation?”**  
> The **focused screen** may provide a **default** answer for requests that don’t specify one.  
> The **app default** applies last and stays conservative until you change `globalDefaults`.  
> **Navigation to Login** is never “free for all”—it always goes through **`safeNavigateToLoginFrom401`** so parallel failures don’t spam the navigator.

---

## Revision history

- Document generated for internal engineering use alongside Auth401 implementation in `innoghte-native-cli-new`.
