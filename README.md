# Innoghte (React Native)

This project now follows a **feature-based architecture** with a strict separation between feature-local code and shared/global code.

## New Source Structure

```text
src/
  features/
    {feature-name}/
      components/
        forms/
        cards/
        list/
      constants/
      screen/
      api/
      hooks/
      styles/
      store/
      types/
      data/
  shared/
    components/
    hooks/
    utils/
    constants/
    styles/
    api/
    navigation/
    types/
    store/
    translations/
    bootstrap/
```

## Architecture Rules

- Put code in `src/features/{feature}` when it is used only by that feature.
- Put code in `src/shared` when it is reused by multiple features or is application-wide.
- Keep screens inside each feature: `src/features/{feature}/screen/{Feature}Screen.tsx`.
- Keep feature API + hooks colocated: `api/` and `hooks/`.
- Keep feature-specific styles inside `styles/`.

## Shared vs Feature

- **Feature folder** examples:
  - `src/features/albums/components/cards/AlbumListCard.tsx`
  - `src/features/auth/components/forms/LoginForm.tsx`
  - `src/features/events/screen/EventsScreen.tsx`
- **Shared folder** examples:
  - `src/shared/navigation/rootNavigator.tsx`
  - `src/shared/styles/theme/index.ts`
  - `src/shared/components/ScreenScaffold.tsx`
  - `src/shared/api/client.ts`

## Add a New Feature

1. Create `src/features/{newFeature}`.
2. Add at least:
   - `screen/{NewFeature}Screen.tsx`
   - `api/index.ts`
   - `hooks/use{NewFeature}.ts`
   - `types/index.ts` and `types/schema.ts` (if validation/types are needed)
3. Add feature components under `components/forms`, `components/cards`, or `components/list`.
4. Register the screen in `src/shared/navigation/rootNavigator.tsx`.

## Best Practices

- Use `@/` absolute imports.
- Avoid cross-feature deep imports; consume via each feature’s public files.
- Keep naming consistent:
  - feature folders: `camelCase`
  - component/screen files: `PascalCase`
  - hooks: `useXxx.ts`
- Do not duplicate shared logic; move it to `src/shared`.

## Authentication & protected navigation

The app uses a small **Zustand auth store** (MMKV-persisted token + flags), **navigation helpers** that queue the intended screen when the user is logged out, and a **hook** for screens and buttons.

### Auth store (`useAuthStore`)

**File:** `src/auth/auth.store.ts`

**When to use**

- After a successful login API response: persist the session and align the HTTP client token.
- On logout (explicit sign-out or forced logout after `401`).
- When you need read-only checks: `isAuthenticated`, `accessToken` (prefer selectors to limit re-renders).

**What is persisted (MMKV via Zustand `persist`):** `isAuthenticated`, `accessToken`.  
**Not persisted:** in-memory `pendingNavigation` (cleared on `logout`).

**Examples**

```ts
import { useAuthStore } from '@/auth/auth.store';

// Login success (e.g. in your auth feature after the API returns a token)
useAuthStore.getState().setAuth({ accessToken: token });

// Then resume the screen the user wanted before login (see below)
import { completePendingAuthNavigation } from '@/shared/navigation/protectedNavigation';
completePendingAuthNavigation();

// Logout
useAuthStore.getState().logout();

// Subscribe in a component (selector avoids extra re-renders)
const isAuthenticated = useAuthStore(s => s.isAuthenticated);
```

`setAuth` / rehydration also syncs `src/shared/api/modules/auth.storage` so `apiClient` keeps sending `Authorization`.

---

### Protected navigation helpers

**File:** `src/shared/navigation/protectedNavigation.ts`  
**Root ref:** `src/shared/navigation/navigationRef.ts` (attached to `Navigation` in `App.tsx`)

| API | When to use |
|-----|----------------|
| `protectedNavigate(navigation, name, params?)` / `navigateProtected` | Default choice: go to a **leaf** route (tab or drawer screen). If logged out, stores **pending navigation** and opens **Login**. |
| `navigateToAppLeaf(navigation, name, params?)` | **Already authenticated** flows only: jump to a leaf without an auth check (e.g. internal routing after login). |
| `protectedPush(navigation, name, params?)` | Stack flows: uses `navigation.push` when available; otherwise falls back like `protectedNavigate`. |
| `protectedDispatch(navigation, action)` | You already have a **React Navigation action** (`CommonActions.navigate`, `StackActions.push`, …) and want the same “queue + Login” behavior when logged out. |
| `completePendingAuthNavigation()` | Call **once after** `setAuth` so the user lands on the queued route, or on **Home** if nothing was queued. Uses `navigationRef`. |

**Typed route names** are `AppLeafRouteName` in `src/shared/navigation/types.ts` (tab names like `Profile`, drawer leaves like `Settings`, etc.). Helpers map tab targets through `MainTabs` automatically.

**Example (imperative, e.g. listener / callback)**

```ts
import { useAuthStore } from '@/auth/auth.store';
import { protectedNavigate } from '@/shared/navigation/protectedNavigation';

// `navigation` from React Navigation (e.g. screen listener props)
protectedNavigate(navigation, 'Profile');
protectedNavigate(navigation, 'Profile', { userId: '42' });
```

**Example (post-login)**

```ts
useAuthStore.getState().setAuth({ accessToken: token });
completePendingAuthNavigation();
```

---

### Hook: `useProtectedNavigation`

**File:** `src/hooks/useProtectedNavigation.ts`

**When to use**

- Inside **any screen or component** that has access to React Navigation context and should trigger a **login-gated** navigation (buttons, list rows, “My purchases”, etc.).

**API:** `navigate`, `push`, `dispatch` — each wraps the corresponding protected helper with the current `navigation` object.

**Example**

```tsx
import { Button } from 'react-native';
import { useProtectedNavigation } from '@/hooks/useProtectedNavigation';

export function GoToProfileButton() {
  const { navigate } = useProtectedNavigation();

  return <Button title="Profile" onPress={() => navigate('Profile')} />;
}
```

**Tab press guard (built-in example):** the **Profile** tab in `src/shared/navigation/rootNavigator.tsx` uses a `tabPress` listener: if the user is not authenticated, the default switch is prevented and `protectedNavigate` sends them to **Login** while queueing **Profile**.

---

### Deep linking & auth (`linkingAuth`)

**File:** `src/shared/navigation/linkingAuth.ts`

**When to use**

- When you configure React Navigation **`linking`** on the static root navigator: wrap `getStateFromPath` so cold starts on a protected URL **store the intended leaf** in `pendingNavigation` and return a **Login** root state instead.

**Example (conceptual)**

```ts
import { getStateFromPath } from '@react-navigation/native';
import {
  APP_LINKING_PREFIXES,
  createAuthAwareGetStateFromPath,
} from '@/shared/navigation/linkingAuth';

const authAwareGetStateFromPath = createAuthAwareGetStateFromPath(
  getStateFromPath,
  /* your linking config */
);

// Pass prefixes + authAwareGetStateFromPath into Navigation `linking` when you enable it.
void APP_LINKING_PREFIXES;
```

After the user logs in, still call `completePendingAuthNavigation()` so the deep link target is applied.

---

### Secure storage (auth persist)

**Files:** `src/storage/mmkv.ts`, `src/storage/zustand-mmkv-storage.ts`

The auth store persists through a **synchronous MMKV** adapter (`innoghte-secure` instance). Optional encryption is driven by env vars (see `src/storage/mmkv.ts`). Use `clearAllStorage()` only when you intend to wipe that MMKV file; then reset or rehydrate app state (e.g. `logout()`) so memory matches disk.

## Run

```sh
npm install
npm start
npm run android
# or npm run ios
```
