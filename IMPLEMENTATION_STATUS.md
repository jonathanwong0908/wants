# Wants — Implementation Status

Last updated: 2026-06-07

Agent-readable tracker of what is implemented vs. deferred. See [prd.md](prd.md) for product intent.

## DB layer convention

- `src/db/client.ts` — Drizzle + expo-sqlite instance
- `src/db/schema.ts` — `items` table definition
- `src/db/migrations.tsx` — runtime migrations + onboarding kv-store gate
- `src/db/mutations/` — write operations (DB inserts/updates/deletes)
- `src/db/queries/` — read operations (`items.ts`: waiting items query)

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
- Read `currencyCode` / `defaultDelayHours` from settings store (currently hardcoded defaults in `useItemForm`)
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

### PRD divergences (intentional)

- Home shows **all** waiting items, not PRD's cap of 3 on Home
- Expired waiting items are in a separate **Ready to decide** section, not mixed into Upcoming with a badge

### Not done

- Real savings total and decision count (hero still placeholder)
- Notification permission banner
- Free-tier FAB paywall gate (lock icon when waiting ≥ 1, non-pro)
- Tap row → Decision screen

## All Wants (PRD S11) — UI shell only

**Files:** `src/app/all-wants.tsx`, `src/constants/placeholder-wants.ts`

### Done

- Upcoming / Past tab layout with placeholder rows

### Not done

- Read from DB (upcoming: `status = waiting`; past: `skipped` / `bought`)
- Past tab summary row (skipped / bought / total saved)
- Free-tier Past tab 30-day history limit + unlock prompt
- Tap row → Decision screen

## Decision / Skipped / Bought modals (PRD S8–S10)

### Not started

- Decision screen modal
- Skip → update status, cancel notification, savings screen
- Buy → update status, cancel notification, bought screen
- Deep link from push notification

## Settings (PRD S12)

**Files:** `src/app/settings/*`, `src/components/settings/settings-screen-shell.tsx`

### Done

- Modal nested stack: hub + notifications, account, data, about placeholder sub-screens
- Hub UI: inline default delay + currency pickers (`FieldContainer` + `SelectDropdown`), navigation rows to sub-screens

### Not done

- Persist default delay and currency to settings store
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
- Deep link payload to Decision screen
- Foreground check for expired waiting items

## Monetization (PRD §8)

### Not started

- RevenueCat integration
- Three enforcement surfaces: Home FAB, custom delay, Past tab history limit
