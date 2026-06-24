# Wants — Implementation Status

Last updated: 2026-06-24

Agent-readable tracker of what is implemented vs. deferred. See [prd.md](prd.md) for product intent.

## DB layer convention

- `src/db/client.ts` — Drizzle + expo-sqlite instance
- `src/db/schema.ts` — `items` table definition
- `src/db/migrations.tsx` — runtime migrations + onboarding kv-store gate
- `src/db/mutations/` — write operations (DB inserts/updates/deletes)
- `src/db/queries/` — read operations (`items.ts`: waiting, past, by-id, savings stats)

## Add Want (PRD S6) — partial

**Files:** `src/app/add-want.tsx`, `src/hooks/use-item-form.ts`, `src/lib/forms/item-form-schema.ts`, `src/db/mutations/items.ts`

### Done

- Form UI: name, price, delay picker (24h / 3d / 1w), optional note
- Zod validation schema (`createItemFormSchema`)
- Save button disabled until form is valid (`mode: "onChange"`, `formState.isValid`)
- Save button disabled while submitting (`formState.isSubmitting`)
- DB insert on submit via `createItem()` in `src/db/mutations/items.ts`
- Modal dismiss on successful save (`router.back()`)
- Computes `notifyAt` as `now + delayHours`
- Schedule local notification at `notifyAt` via `src/lib/notifications.ts`; persist `notifId`

### Not done (follow-ups)

- Free-tier paywall gate on Add screen (waiting items ≥ 1, non-pro) — see [PAYMENTS_PLACEHOLDER.md](PAYMENTS_PLACEHOLDER.md)
- Custom delay — **deferred** (not in placeholder scope)
- Show validation errors inline (`FormMessage` not wired on form fields yet)

## Home (PRD S5) — partial

**Files:** `src/app/home.tsx`, `src/components/wants/*`, `src/db/queries/items.ts`, `src/hooks/use-now-tick.ts`, `src/constants/placeholder-wants.ts`

### Done

- Layout: settings button, savings hero, upcoming + ready-to-decide lists, FAB
- Navigation to settings, all-wants, add-want modals
- Read waiting items from DB via `useLiveQuery` + `selectWaitingItems()`
- SQLite change listeners enabled on `openDatabaseSync`
- Upcoming section: all not-yet-expired waiting items, countdown from `notifyAt`, empty state
- Ready to decide section: expired waiting items in separate section (hidden when empty)
- Reusable list row + section builder (`WantListRow`, `waiting-want-list.tsx`) with `@legendapp/list`
- `useNowTick`: AppState foreground + 60s interval for section moves and countdown copy
- Tap row → Want detail modal (`/want/[id]`)
- Notification permission banner when denied + waiting items exist (`notification-permission-banner.tsx`); dismiss persists in kv-store until a new waiting item is added

### PRD divergences (intentional)

- Home shows **all** waiting items, not PRD's cap of 3 on Home
- Expired waiting items are in a separate **Ready to decide** section, not mixed into Upcoming with a badge

### Not done

- Free-tier FAB paywall gate (lock icon when waiting ≥ 1, non-pro) — see [PAYMENTS_PLACEHOLDER.md](PAYMENTS_PLACEHOLDER.md)

## All Wants (PRD S11) — partial

**Files:** `src/app/all-wants.tsx`, `src/components/wants/*`

### Done

- Upcoming / Past tab layout
- Read from DB via `useLiveQuery` (upcoming: `status = waiting`; past: `skipped` / `bought`)
- Past tab summary row (skipped / bought / total saved)
- Tap row → Want detail modal (`/want/[id]`) — both Upcoming and Past tabs

### PRD divergences (intentional)

- Past tab rows are tappable (PRD S11 only specifies Upcoming → Decision)

### Not done

- Free-tier Past tab 30-day history limit + unlock prompt — see [PAYMENTS_PLACEHOLDER.md](PAYMENTS_PLACEHOLDER.md)

## Want Detail (PRD S8 scaffold) — partial

**Files:** `src/app/want/[id].tsx`, `src/components/wants/want-detail-content.tsx`, `src/components/wants/want-decision-actions.tsx`, `src/lib/push-want-route.ts`, `src/lib/want-format.ts`, `src/lib/date-format.ts`, `src/db/queries/items.ts`, `src/db/mutations/items.ts` (`skipItem`, `buyItem`)

### Done

- Modal route `/want/[id]` registered in root stack
- Read single item via `useLiveQuery` + `selectItemById(id)`
- Read-only display: name, price, status (countdown / ready / saved / bought), wait period, added date, decides-on (waiting), decided date (past), note
- Invalid or missing id → "Want not found" empty state
- Navigation from Home and All Wants list rows via `pushWantRoute(id)`
- Decision buttons for waiting items: "Moved on" (skip) and "Buy it" (buy)
- Skip: `skipItem()` sets `status = skipped`, `decidedAt = now`, cancels scheduled notification; `router.back()` closes modal (no success alert); Home / All Wants savings + lists refresh via `useLiveQuery`
- Buy: `Alert.alert` confirmation → `buyItem()` sets `status = bought`, `decidedAt = now`, cancels scheduled notification; `router.back()` closes modal; cancel dismisses alert only
- Deep link from push notification tap → `/want/[id]` via `use-notification-observer`

### Not done (follow-ups)

- Delete from want detail (delete lives on edit screen only — see Edit Want)

## Edit Want — partial

**Files:** `src/app/edit-want/[id].tsx`, `src/components/wants/item-form-fields.tsx`, `src/db/mutations/items.ts` (`updateItem`, `deleteItem`), `src/lib/delete-want-alert.ts`, `src/lib/push-edit-want-route.ts`, `src/lib/forms/item-form-schema.ts`, `src/lib/want-format.ts`

### Done

- Edit icon (Pencil) on want detail header → `/edit-want/[id]` modal
- Shared `ItemFormFields` extracted from add-want; add-want refactored to use it
- Pre-filled form via `useItemForm` + `itemToFormDefaultValues(item)`; form remounts with `key={item.id}`
- Waiting items: edit name, price, delay, note; `notifyAt` recalculated as `createdAt + delayHours` when delay changes
- Skipped / bought items: edit name, price, note only (delay field hidden; `delayHours` / `notifyAt` unchanged in DB)
- `getDelayOptionsForValue` for non-preset delay values (future custom delay)
- `updateItem()` Drizzle mutation; `router.back()` on success; detail auto-refreshes via `useLiveQuery`
- Delete: destructive trash icon in edit header; `Alert.alert` confirmation; hard delete via `deleteItem()`; `router.dismiss(2)` returns to Home / All Wants
- Skipped-item delete: savings-aware confirmation — same currency warns price will be removed from Home saved total; other currency explains saved total unchanged (`src/lib/delete-want-alert.ts`)
- `deleteItem()` cancels scheduled notification when `notifId` is set
- Cancel + reschedule notification on edit when name, price, or delay changes (waiting items)

### Not done (follow-ups)

- Paywall gate on edit (same as add — not built yet)
- Custom delay — **deferred**

## Decision flow (PRD S8) — done

- Skip / buy from want detail with notification cancel; dismiss modal (no post-decision celebration screens per PRD v1.4)
- Early check-in: decision buttons always available before timer expires
- Deep link from push notification → want detail modal

## Settings (PRD S12)

**Files:** `src/app/settings/*`, `src/components/settings/settings-screen-shell.tsx`

### Done

- Modal nested stack: hub + notifications, account, data, about placeholder sub-screens
- Hub UI: inline default delay + currency pickers (`FieldContainer` + `SelectDropdown`), navigation rows to sub-screens
- Persist default delay and currency via `expo-sqlite/kv-store` (`default_delay_hours`, `currency` keys)
- `SettingsProvider` + `useSettings()` hook for reactive reads/writes
- First-run currency seed from device locale on onboarding completion (`expo-localization`)
- `useItemForm`, Home, and All Wants wired to settings
- Notifications sub-screen: permission status + Open system settings when not granted
- Clear all data: wipes items table, cancels scheduled notifications; preserves kv-store prefs
- About screen: app version via expo-constants

### Not done

- Account screen upgrade / restore (placeholder or RevenueCat) — see [PAYMENTS_PLACEHOLDER.md](PAYMENTS_PLACEHOLDER.md) Phase P3
- About privacy policy and terms links (blocked on URLs)

### Theme (PRD S12) — partial

**Files:** `src/app/settings/theme.tsx`

#### Done

- Premium theme pro gate (4th PRD §8 enforcement surface): lock icon + paywall when non-pro selects pro-tier theme

## Paywall (PRD S13) — partial

**Files:** `src/app/paywall.tsx`, `src/lib/push-paywall-route.ts`, `src/app/_layout.tsx`

### Done

- Modal route registered; shell placeholder screen
- `pushPaywallRoute()` helper

### Not done

- Full paywall UI (PRD S13): benefits, plan cards, CTA, restore, dismiss
- Placeholder or RevenueCat purchase flow — [PAYMENTS_PLACEHOLDER.md](PAYMENTS_PLACEHOLDER.md) Phase P2; [PAYMENTS_SETUP.md](PAYMENTS_SETUP.md) Phase 4

## Onboarding (PRD S4)

**Files:** `src/app/(onboarding)/*`, `src/db/migrations.tsx`

### Done

- Welcome, how-it-works, social-proof, notification-permission screens
- Permission request + mark onboarding complete (kv-store)
- Navigate to Home on completion

## Notifications (PRD §7)

**Files:** `src/lib/notifications.ts`, `src/hooks/use-notification-observer.ts`, `src/hooks/use-notification-reconciliation.ts`, `src/hooks/use-notification-permission.ts`, `src/components/notification-bootstrap.tsx`, `src/components/wants/notification-permission-banner.tsx`

### Done

- Permission request during onboarding
- `setNotificationHandler` for foreground display
- Android notification channel (`wants-decisions`)
- Schedule per-item local notification at `notifyAt` (DATE trigger); PRD S7 title/body copy
- Persist `notifId` on create; backfill on foreground via `selectWaitingItemsNeedingSchedule`
- Cancel on skip / buy / delete
- Reschedule on edit when name, price, or delay changes
- Deep link on notification tap → `/want/[id]` (cold start + warm via `getLastNotificationResponse` + response listener)
- Permission re-check on foreground (`use-notification-permission`)
- Home permission banner when denied + waiting items exist
- Settings notifications screen: status + link to system settings
- Expired-waiting UI fallback via existing `useNowTick` + Ready to decide section

### Not done (follow-ups)

- iOS 64 scheduled-notification prioritization for Pro unlimited waiting items (when paywall ships)

## Monetization (PRD §8)

PRD defines **four** enforcement surfaces (FAB, custom delay, past tab, theme). Placeholder implements three; custom delay deferred.

### Placeholder (local `is_pro`) — not started

Checklist: [PAYMENTS_PLACEHOLDER.md](PAYMENTS_PLACEHOLDER.md)

- `ProProvider` + stub purchase/restore
- Paywall UI, Account screen, FAB/add guard, past-tab cap
- Dev toggle pro for testing

**Partial infrastructure already in repo:** `IS_PRO_KEY`, `useIsPro()` (kv-store), paywall route, theme gate.

### RevenueCat integration — not started

Setup: [PAYMENTS_SETUP.md](PAYMENTS_SETUP.md) (Phases 0a–7)

- Test Store (`test_` key) then Apple sandbox (`appl_` key)
- `PurchasesProvider` replaces placeholder `ProProvider`
- Custom delay gate (deferred; UX TBD)
