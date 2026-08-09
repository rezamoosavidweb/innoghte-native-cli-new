# Design QA — Global RTL, basket header, and gift multi-select

## Visual truth and test state

- Source screenshot: `C:\Users\Admin\AppData\Local\Temp\codex-clipboard-b6390338-2f63-4c67-8008-90c1332bc0a2.png` (469 × 982).
- Final device capture: `qa-artifacts/gift-form-controls-rtl-multiselect.png` (1080 × 2340).
- Same-viewport comparison: `qa-artifacts/gift-reference-vs-implementation-final.png`.
- Comparison normalization: the final device capture was scaled to 982 px high and horizontally padded to a 469 × 982 canvas before the side-by-side comparison.
- State: authenticated staging account, default dark theme, portrait Android emulator, gift form scrolled to recipient/product fields, empty cart, keyboard closed.
- Additional focused evidence: `qa-artifacts/gift-course-multiselect-two-selected.png` and `qa-artifacts/ticket-create-rtl-fixed.png`.

## Web behavior reference

The authenticated staging gift form was inspected at `https://stg-web.innoghte.ir/dashboard/give-gift`. It exposes four multi-value selectors: courses, albums, live meetings (روی‌خط‌ها), and books. The React web source confirms the same four groups and multi-select behavior.

## Iteration history

1. The supplied screenshot showed a back arrow, individual checkbox rows, only course/album groups, and inconsistent RTL form alignment. Those are the requested behavior changes, not fidelity targets to preserve.
2. The first device pass exposed a P2 RTL defect: raw ticket input placeholders still aligned left. Shared form/ticket input styles were corrected to use right alignment and RTL writing direction, then recaptured in `ticket-create-rtl-fixed.png`.
3. The final pass verified the shared basket icon on the physical top-left, four collapsed multi-select controls, two simultaneous course selections, right-aligned Persian labels/placeholders, and the absence of checkbox UI.

## Required fidelity surfaces

- Typography: Persian hierarchy and weights remain readable; labels and placeholder text follow RTL direction.
- Spacing: field rhythm, sheet rows, chips, and header spacing are consistent at the 1080 × 2340 device viewport.
- Colors: requested default dark palette has sufficient foreground, border, and selected-state contrast.
- Image quality/assets: the flow uses existing vector navigation assets; no raster assets are stretched or replaced.
- Copy/content: labels match staging behavior: «دوره‌ها»، «آلبوم‌ها»، «روی‌خط‌ها»، and «کتاب‌ها»; the «عمومی» suffix is removed.

## Final assessment

- Global basket header position and live count: passed.
- RTL form labels, placeholders, values, and structure: passed.
- Gift multi-select interaction and multi-value selection: passed.
- Staging gift category parity: passed.
- Ticket list/create-form RTL check: passed.
- TypeScript and targeted lint validation: passed.
- Remaining actionable P0/P1/P2 visual defects: none.

final result: passed

---

# Design QA — Sent/received gift history and details

## Visual truth and test state

- Mobile web captures: `qa-artifacts/stage-gift-given-mobile.png` and `qa-artifacts/stage-gift-received-mobile.png` (469 × 982).
- Final device captures: `qa-artifacts/gift-sent-web-table-final.png` and `qa-artifacts/gift-received-web-table-final3.png` (1080 × 2340).
- Focused interaction evidence: `qa-artifacts/gift-details-modal-final.png`.
- Same-viewport comparisons: `qa-artifacts/gift-given-web-vs-app-final.png` and `qa-artifacts/gift-received-web-vs-app-final.png`.
- Comparison normalization: device captures were scaled to 982 px high and horizontally padded to a 469 × 982 canvas.
- State: authenticated staging account, default dark theme, portrait Android emulator, one sent gift, no received gifts, keyboard closed.

## Web behavior reference

- Web implementation inspected in `frontenduser2/src/features/dashboard/gift-given/GiftGiven.tsx`, `PresentRow.tsx`, and `Modal.tsx`, plus the corresponding `gift-received` files.
- Mobile web uses a rounded dark panel containing a horizontally scrollable RTL table. Sent gifts expose recipient, products, currency, message, receive/payment state, order date, and details; received gifts expose the matching sender/tracking fields.
- The details modal presents product/amount rows followed by payment state, total amount, and order identifier. The current staging record has no payment/product payload, so the app correctly renders unavailable values while preserving the real order identifier.

## Implementation surfaces

- `src/domains/user/screens/GiftSubScreen.tsx`
- `src/domains/user/screens/giftSubScreen.styles.ts`
- `src/domains/user/components/giftHistory/GiftHistoryTable.tsx`
- `src/domains/user/components/giftHistory/GiftDetailsModal.tsx`

## Iteration history

1. The previous app UI was a vertical text-dump card while mobile web was a structured horizontal table (P1). It was replaced with a shared RTL table for sent and received histories.
2. The first table pass opened on the date/details columns because of a double RTL reversal (P1). Column ordering and initial scroll alignment were corrected so recipient/sender data starts on the physical right.
3. The first modal pass reversed its title, labels, and values (P2). Modal row direction was corrected and recaptured.
4. The initial received-empty pass placed the scrollbar between the header and empty message (P2). The empty state now lives in the table track, with the scrollbar at the panel bottom.
5. Final side-by-side review found no actionable P0/P1/P2 visual defects.

## Required fidelity surfaces

- Typography: Persian headings, table headers, body values, and modal hierarchy match the web weight and RTL alignment; email values remain intentionally LTR.
- Spacing: panel inset, header divider, table row rhythm, modal padding, and rounded corners track the mobile web composition.
- Colors: dark background, elevated panel, dividers, muted text, and status treatments use the existing application tokens and match staging contrast.
- Image quality/assets: the modal uses the repository's existing vector close icon; no placeholder or stretched raster asset was introduced.
- Copy/content: table labels, empty text, statuses, and modal fields match the staging web wording and data mappings.

## Final assessment

- Sent gift list visual parity and horizontal navigation: passed.
- Received gift list and in-table empty state: passed.
- Whole sent row/card opens gift details: passed.
- Gift details fields, RTL layout, dismiss behavior, and real order identifier: passed.
- Authenticated emulator flow, TypeScript, targeted lint, and runtime error scan: passed.
- Remaining actionable P0/P1/P2 visual defects: none.

final result: passed
