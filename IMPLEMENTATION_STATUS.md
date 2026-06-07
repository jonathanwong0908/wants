# Wants — Implementation Status

Last updated: 2026-06-07

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
- Stores `notifId: null` (notification scheduling deferred)

### Not done (follow-ups)

- Schedule expo-notifications at `notifyAt` and persist `notifId`
- Free-tier paywall gate on Add screen (waiting items ≥ 1, non-pro)
- Custom delay option (pro only)
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

### PRD divergences (intentional)

- Home shows **all** waiting items, not PRD's cap of 3 on Home
- Expired waiting items are in a separate **Ready to decide** section, not mixed into Upcoming with a badge

### Not done

- Notification permission banner
- Free-tier FAB paywall gate (lock icon when waiting ≥ 1, non-pro)

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

- Free-tier Past tab 30-day history limit + unlock prompt

## Want Detail (PRD S8 scaffold) — partial

**Files:** `src/app/want/[id].tsx`, `src/components/wants/want-detail-content.tsx`, `src/components/wants/want-decision-actions.tsx`, `src/lib/push-want-route.ts`, `src/lib/want-format.ts`, `src/lib/date-format.ts`, `src/db/queries/items.ts`, `src/db/mutations/items.ts` (`skipItem`, `buyItem`)

### Done

- Modal route `/want/[id]` registered in root stack
- Read single item via `useLiveQuery` + `selectItemById(id)`
- Read-only display: name, price, status (countdown / ready / saved / bought), wait period, added date, decides-on (waiting), decided date (past), note
- Invalid or missing id → "Want not found" empty state
- Navigation from Home and All Wants list rows via `pushWantRoute(id)`
- Decision buttons for waiting items: "Moved on" (skip) and "Buy it" (buy)
- Skip: `skipItem()` sets `status = skipped`, `decidedAt = now`, cancels `notifId` if set; `router.back()` closes modal (no success alert); Home / All Wants savings + lists refresh via `useLiveQuery`
- Buy: `Alert.alert` confirmation → `buyItem()` sets `status = bought`, `decidedAt = now`, cancels `notifId` if set; `router.back()` closes modal (no S10 screen); cancel dismisses alert only

### PRD divergences (intentional)

- Skip does not navigate to S9 "You saved it!" celebration modal
- Buy does not navigate to S10 "Bought / Logged!" celebration modal
- Early skip and early buy allowed — both buttons enabled before timer expires (no "Check in early" gate yet)

### Not done (follow-ups)

- "Check in early" progressive reveal UI for non-expired waiting items
- Delete from want detail (delete lives on edit screen only — see Edit Want)
- Deep link from push notification

## Edit Want — partial

**Files:** `src/app/edit-want/[id].tsx`, `src/components/wants/item-form-fields.tsx`, `src/db/mutations/items.ts` (`updateItem`, `deleteItem`), `src/lib/push-edit-want-route.ts`, `src/lib/forms/item-form-schema.ts`, `src/lib/want-format.ts`

### Done

- Edit icon (Pencil) on want detail header → `/edit-want/[id]` modal
- Shared `ItemFormFields` extracted from add-want; add-want refactored to use it
- Pre-filled form via `useItemForm` + `itemToFormDefaultValues(item)`; form remounts with `key={item.id}`
- Waiting items: edit name, price, delay, note; `notifyAt` recalculated as `createdAt + delayHours` when delay changes
- Skipped / bought items: edit name, price, note only (delay field hidden; `delayHours` / `notifyAt` unchanged in DB)
- `getDelayOptionsForValue` for non-preset delay values (future custom delay)
- `updateItem()` Drizzle mutation; `router.back()` on success; detail auto-refreshes via `useLiveQuery`
- Delete: destructive trash icon in edit header; `Alert.alert` confirmation; hard delete via `deleteItem()`; `router.dismiss(2)` returns to Home / All Wants
- `deleteItem()` cancels scheduled notification via `cancelScheduledNotificationAsync(notifId)` when `notifId` is set (no-op today — scheduling not wired yet)

### Not done (follow-ups)

- Cancel + reschedule notification on edit when `notifyAt` or `delayHours` changes (blocked on notification scheduling — see Add Want follow-ups)
- Paywall / custom delay pro gate on edit (same as add — not built yet)

## Decision / Skipped / Bought modals (PRD S8–S10) — partial

### Done

- Skip from want detail: `skipItem()` mutation, notification cancel stub, dismiss modal (no S9 screen)
- Buy from want detail: `buyItem()` mutation, `Alert.alert` confirmation, notification cancel stub, dismiss modal (no S10 screen)

### Not done

- S9 "You saved it!" celebration modal
- S10 "Bought / Logged!" celebration modal
- Deep link from push notification

## Settings (PRD S12)

**Files:** `src/app/settings/*`, `src/components/settings/settings-screen-shell.tsx`

### Done

- Modal nested stack: hub + notifications, account, data, about placeholder sub-screens
- Hub UI: inline default delay + currency pickers (`FieldContainer` + `SelectDropdown`), navigation rows to sub-screens
- Persist default delay and currency via `expo-sqlite/kv-store` (`default_delay_hours`, `currency` keys)
- `SettingsProvider` + `useSettings()` hook for reactive reads/writes
- First-run currency seed from device locale on onboarding completion (`expo-localization`)
- `useItemForm`, Home, and All Wants wired to settings

### Not done
- Notification status + link to system settings
- RevenueCat upgrade / restore
- Clear all data
- About links

## Paywall (PRD S13)

### Not started

## Onboarding (PRD S4)

**Files:** `src/app/(onboarding)/*`, `src/db/migrations.tsx`

### Done

- Welcome, how-it-works, social-proof, notification-permission screens
- Permission request + mark onboarding complete (kv-store)
- Navigate to Home on completion

## Notifications (PRD §7)

### Done

- Permission request during onboarding

### Not done

- Schedule per-item notification at `notifyAt`
- Cancel on decision
- Deep link payload to Want detail screen (`/want/[id]`)
- Foreground check for expired waiting items

## Monetization (PRD §8)

### Not started

- RevenueCat integration
- Three enforcement surfaces: Home FAB, custom delay, Past tab history limit
