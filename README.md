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

## Run

```sh
npm install
npm start
npm run android
# or npm run ios
```
