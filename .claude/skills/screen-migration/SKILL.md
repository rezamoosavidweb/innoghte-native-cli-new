---
name: screen-migration
description: How to migrate/build/re-skin a React Native screen in innoghte-native-cli-new from a Figma design + the innoghte-web logic. Use whenever the user asks to implement, fix, re-skin, or port a screen, mentions a Figma design, or references an innoghte-web component as the source of logic. Encodes the mandatory phased workflow and the recurring conventions agreed in this project.
---

# Screen Migration Workflow (innoghte-native-cli-new)

Build RN screens from a Figma design while reusing the existing architecture,
components, themes, API layer, and business logic. **Plan before coding. Reuse
before creating. Verify on the device.**

## Sources of truth
- **Figma = visual truth.** Pull via the `figma` MCP (`get_figma_data`). It is
  **heavily rate-limited (HTTP 429, ~23h)** on this plan — when blocked, use the
  screenshot the user provides as the visual spec and say values are inferred.
- **innoghte-web = business-logic & API truth.** It lives at
  `f:\github\react-native\innoghte-web` (sibling repo, read via absolute path).
  Find the matching page/component and mirror its API calls, payload field
  names, validation, and flows. **Always check BOTH `.com` and `.ir` paths.**
- The user's running app is **`emulator-5554`** (an `.ir` build). Figma mocks are
  usually the **`.com`** variant — so a `.com`-only element's absence on the
  emulator is expected, not a bug.

## Phased process (do not skip)
1. **Analyze**: read `CLAUDE.md`, the domain, navigation, theme tokens, and the
   existing components/hooks/services you could reuse.
2. **Spec**: break the screen into sections; list local/server/loading/error/
   empty states and the data flow (queries, mutations, navigation).
3. **Map** each Figma section to an existing component/pattern; only plan a new
   file when nothing fits.
4. **Validate**: confirm it matches the architecture and that you are not
   duplicating an existing component/hook/service.
5. **Implement**: production-ready, strict TS, no dead code, no TODOs, no mocks.
6. **Self-review** against Figma (spacing/typography/color/order) + run the
   quality gates + verify on the emulator.

## Region rules (`isDotIr` from `@/shared/config/resolveIsDotIr`)
- **Payment endpoints differ**: `.ir` → `payment/create`, `payment/verify`
  (Zarinpal/Vandar gateways); `.com` → `payment/paypal/create`,
  `payment/paypal/verify` (PayPal/credit-card). Mirror web's
  `isDotIr ? postCreatePayment : postCreatePaymentPaypal`.
- **Currency**: `.ir` Toman (order/verify prices arrive in **Rial → ÷10** for
  display, like web `SuccessOrder`); `.com` USD.
- Gate UI by region: `.com` shows the brand payment cards; `.ir` shows the
  gateway chips.

## Reuse & sharing
- Reuse existing components/hooks/services/tokens. **If a component is needed by
  2+ domains, move it to `src/ui/components/<Name>/`** (a shared `ui` component
  must not import from `domains`). Repoint the original importer and delete the
  per-domain copy (no dead code). Example: `@/ui/components/SelectPaymentType`
  (PayPal / Venmo-disabled / Card brand cards), shared by basket + donation.
- **Mobile / phone number in ANY form → use `@/ui/components/PhoneInput`** (the
  same component used by register, login, and edit-profile). Wire it with RHF
  `Controller`: `value`, `onChange`, `onBlur`, `error`, `touched`.
  - `.ir`: pass `disableDropdown` (country **locked to Iran +98**).
  - `.com`: leave the dropdown enabled (**country selectable**).
  - Prefill from the current user, editable, mirroring `EditProfileScreen`:
    `{ ...defaultPhoneInputValue(), dial: (user.mobile ?? '').replace(/^00/, '') }`.
  - Schema shape: `z.object({ dial, countryCode, dialCode })` (see
    `editProfileForm.schema.ts` / `registerFormSchema.ts`).
- **Multi-line text in ANY form → use `@/ui/components/Textarea`** (never a raw
  multiline `TextInput`). Pass `maxLength` to get a live "characters remaining"
  counter that starts at `maxLength` and counts down as the user types.

## Styling
- Only **semantic theme tokens**: `useThemeColors()` / `pickSemantic(theme)`,
  `spacing`, `radius`, `fontSize`, `fontWeight`, `hexAlpha`, `lineHeight`. No raw
  hex — unless the user gives an exact design color (then name it as a const and
  comment it). Keep the look consistent across sibling screens (basket↔donation).
- Each component owns a `*.styles.ts` factory (`useXStyles(colors)` /
  `createXStyles(...)`), memoized.
- **Match the Figma layout exactly** — e.g. if the design lays sections flat on
  the background, do NOT wrap them in boxed `card` containers; payment/gateway
  selection goes where the design puts it (commonly above the contact form).
- RTL: the shared `Text` handles Persian alignment; use logical layout. A
  leading field icon (user/mail) goes on the **right** — render it as the
  **first child** of the input row so RTL places it at the start.

## Amount inputs
- Display with thousands separators via `groupThousands` (`@/shared/utils`); keep
  the **raw, separator-free** value in state for the API. Make the field
  editable (let users override presets); editing marks it custom.

## Quality gates (before declaring done)
- `cd innoghte-native-cli-new && npx tsc --noEmit` → clean.
- `npx eslint "src/domains/<area>/**/*.{ts,tsx}"` → exit 0.
- Remove dead code (orphaned components/styles when you replace something).
- **Verify on `emulator-5554`**: `adb -s emulator-5554 exec-out screencap -p > out.png`,
  crop with Python PIL (ImageMagick is NOT installed). To reach a screen
  deterministically, temporarily set the drawer `initialRouteName`, screenshot,
  then **revert it**. The first launch shows `StartupScreen` once.

## Don't
- Don't start coding before planning, or modify unrelated files.
- Don't introduce a new pattern when an existing one fits.
- Don't add fields/params the web/API doesn't support (e.g. web donation has no
  mobile field → don't send one) without confirming with the user.
