# Wants — Implementation Status

Last updated: 2026-06-07

Agent-readable tracker of what is implemented vs. deferred. See [prd.md](prd.md) for product intent.

## DB layer convention

- `src/db/client.ts` — Drizzle + expo-sqlite instance
- `src/db/schema.ts` — `items` table definition
- `src/db/migrations.tsx` — runtime migrations + onboarding kv-store gate
- `src/db/mutations/` — write operations (DB inserts/updates/deletes)
- `src/db/queries/` — read operations (not created yet; add when screens read from DB)

## Add Want (PRD S6) — partial

**Files:** `src/app/add-want.tsx`, `src/hooks/use-item-form.ts`, `src/lib/forms/item-form-schema.ts`, `src/db/mutations/items.ts`

### Done

- Form UI: name, price, delay picker (24h / 3d / 1w), optional note
- Zod validation schema (`createItemFormSchema`)
- Save button disabled until form is valid (`mode: "onChange"`, `formState.isValid`)
- Save button disabled while submitting (`formState.isSubmitting`)
- DB insert on submit via `createItem()` in `src/db/mutations/items.ts`
- Modal dismiss on successful save (`router.back()`)
- Computes `notifyAt` as `now + delayHours` (no `notify_hour` adjustment yet)
- Stores `notifId: null` (notification scheduling deferred)

### Not done (follow-ups)

- Schedule expo-notifications at `notifyAt` and persist `notifId`
- `notify_hour` adjustment from settings (PRD §7)
- Read `currencyCode` / `defaultDelayHours` from settings store (currently hardcoded defaults in `useItemForm`)
- Free-tier paywall gate on Add screen (waiting items ≥ 1, non-pro)
- Custom delay option (pro only)
- Show validation errors inline (`FormMessage` not wired on form fields yet)

## Home (PRD S5) — UI shell only

**Files:** `src/app/home.tsx`, `src/constants/placeholder-wants.ts`

### Done

- Layout: settings button, savings hero, upcoming list, FAB
- Navigation to settings, all-wants, add-want modals

### Not done

- Read waiting items from DB (`src/db/queries/items.ts`)
- Real savings total and decision count
- Countdown timers from `notifyAt`
- "Ready to decide" badge for expired items
- Notification permission banner
- Free-tier FAB paywall gate (lock icon when waiting ≥ 1, non-pro)

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

**Files:** `src/app/settings.tsx`

### Done

- Screen shell (navigation only)

### Not done

- Default delay, currency, notify hour pickers
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
- `notify_hour` clock adjustment
- Deep link payload to Decision screen
- Foreground check for expired waiting items

## Monetization (PRD §8)

### Not started

- RevenueCat integration
- Three enforcement surfaces: Home FAB, custom delay, Past tab history limit
