# Wants — Implementation Status

Last updated: 2026-06-25

Agent-readable tracker of what is implemented vs. deferred. See [prd.md](prd.md) for product intent.

**Payments / Apple / RevenueCat:** [PAYMENTS_SETUP.md](PAYMENTS_SETUP.md) (Phases 0a–7). Not listed below.

---

## Remaining work — non-payments (prioritized)

Tick off as you complete them. Safe to implement without Apple sandbox or StoreKit.

### P0 — Before TestFlight / App Store

- [x] **Privacy Policy + Terms URLs** — `PRIVACY_POLICY_URL` / `TERMS_OF_USE_URL` in `src/constants/legal-links.ts`; About rows + paywall footer via `src/components/legal/legal-links.tsx`
- [x] **`ios.buildNumber` in `app.json`** — required for EAS / App Store uploads alongside `version`

### P1 — Product polish (no payments dependency)

- [x] **About screen legal links** — Privacy / Terms rows on About; shared `LegalLinkSettingsRows` / `openLegalLink`
- [x] **Remove custom-delay copy** — paywall benefits, placeholder offerings, docs; do not implement the feature
- [x] **iOS 64-notification prioritization** — when active waiting items exceed iOS local schedule cap, prioritize soonest `notifyAt` (`src/lib/notifications.ts`, reconciliation hooks)

### P2 — Optional for v1

- [ ] **Delete from want detail** — delete only on edit screen today (`src/app/want/[id].tsx`)
- [ ] **Home: cap Upcoming at 3 items** — PRD S5; app currently shows all waiting items (see PRD divergences under Home)
- [ ] **Refresh this file** — keep screen-by-screen sections in sync as items ship

### P3 — Defer (not payments; not app code now)

- Store listing assets (screenshots, description) — App Store Connect
- Android `package` + parity — PRD: iOS first
- PostHog analytics — PRD: optional v2
- PRD divergences (Ready section split, past rows tappable) — intentional unless you change UX
- v2/v3 (widget, share card, iCloud, streaks, templates) — see PRD §10

---

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
- Free-tier paywall gate: `useFocusEffect` + `router.replace` to paywall when gated; form hidden until waiting count resolves

### Not done (follow-ups)

- None

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
- Free-tier FAB paywall gate: Plus icon always; opens paywall instead of add-want when waiting ≥ 1 and not pro

### PRD divergences (intentional)

- Home shows **all** waiting items, not PRD's cap of 3 on Home
- Expired waiting items are in a separate **Ready to decide** section, not mixed into Upcoming with a badge

## All Wants (PRD S11) — partial

**Files:** `src/app/all-wants.tsx`, `src/components/wants/*`

### Done

- Upcoming / Past tab layout
- Read from DB via `useLiveQuery` (upcoming: `status = waiting`; past: `skipped` / `bought`)
- Past tab summary row (skipped / bought / total saved)
- Tap row → Want detail modal (`/want/[id]`) — both Upcoming and Past tabs

### PRD divergences (intentional)

- Past tab rows are tappable (PRD S11 only specifies Upcoming → Decision)

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

- Delete from want detail — see backlog P2 (delete on edit screen only)

## Edit Want — partial

**Files:** `src/app/edit-want/[id].tsx`, `src/components/wants/item-form-fields.tsx`, `src/db/mutations/items.ts` (`updateItem`, `deleteItem`), `src/lib/delete-want-alert.ts`, `src/lib/push-edit-want-route.ts`, `src/lib/forms/item-form-schema.ts`, `src/lib/want-format.ts`

### Done

- Edit icon (Pencil) on want detail header → `/edit-want/[id]` modal
- Shared `ItemFormFields` extracted from add-want; add-want refactored to use it
- Pre-filled form via `useItemForm` + `itemToFormDefaultValues(item)`; form remounts with `key={item.id}`
- Waiting items: edit name, price, delay, note; `notifyAt` recalculated as `createdAt + delayHours` when delay changes
- Skipped / bought items: edit name, price, note only (delay field hidden; `delayHours` / `notifyAt` unchanged in DB)
- `getDelayOptionsForValue` for non-preset delay values (legacy data)
- `updateItem()` Drizzle mutation; `router.back()` on success; detail auto-refreshes via `useLiveQuery`
- Delete: destructive trash icon in edit header; `Alert.alert` confirmation; hard delete via `deleteItem()`; `router.dismiss(2)` returns to Home / All Wants
- Skipped-item delete: savings-aware confirmation — same currency warns price will be removed from Home saved total; other currency explains saved total unchanged (`src/lib/delete-want-alert.ts`)
- `deleteItem()` cancels scheduled notification when `notifId` is set
- Cancel + reschedule notification on edit when name, price, or delay changes (waiting items)

### Not done (follow-ups)

- None

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
- About screen: app version via expo-constants; Privacy Policy + Terms of Use links (`src/components/legal/legal-links.tsx`)

### Theme (PRD S12) — partial

**Files:** `src/app/settings/theme.tsx`

#### Done

- Premium theme pro gate (4th PRD §8 enforcement surface): lock icon + paywall when non-pro selects pro-tier theme

## Paywall (PRD S13) — done

**Files:** `src/app/paywall.tsx`, `src/lib/paywall-offerings.ts`, `src/lib/push-paywall-route.ts`, `src/contexts/purchases-context.tsx`

### Done

- Modal route; `pushPaywallRoute()` helper
- Benefits copy, plan tabs (monthly / annual / lifetime), dynamic prices from RevenueCat offerings
- CTA → `purchasePackage()`; dismiss on success; legal footer with Privacy / Terms links
- Restore on Subscription settings screen only (not on paywall)

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
- Persist `notifId` on create; backfill on foreground via `reconcileWaitingWantNotifications()`
- Cancel on skip / buy / delete
- Reschedule on edit when name, price, or delay changes
- Deep link on notification tap → `/want/[id]` (cold start + warm via `getLastNotificationResponse` + response listener)
- Permission re-check on foreground (`use-notification-permission`)
- Home permission banner when denied + waiting items exist
- Settings notifications screen: status + link to system settings
- Expired-waiting UI fallback via existing `useNowTick` + Ready to decide section
- iOS 64 pending-notification cap: `reconcileWaitingWantNotifications()` keeps soonest 64 future waiting items scheduled; backfills on foreground and after create / edit / skip / buy / delete / import

### Not done (follow-ups)

- None

## Monetization (PRD §8)

PRD lists two enforcement surfaces (FAB, theme). v1 ships both.

### RevenueCat in app — done (Test Store)

**Files:** `src/contexts/purchases-context.tsx`, `src/lib/purchases.ts`, `src/hooks/use-is-pro.ts`

- `PurchasesProvider` + `usePurchases()` / `useIsPro()` — configure, offerings, purchase, restore, foreground refresh
- Entitlement `pro` mirrored to kv-store `is_pro`
- Gates: Home FAB + add-want, premium theme selection
- Dev-only Toggle Pro on Home (`!isProduction`)
- Paywall + Subscription settings wired to RevenueCat (Expo Go + `test_` key)

### Not done (payments infra — see PAYMENTS_SETUP.md)

- Phase 0b: App Store Connect app, agreements, sandbox tester
- Phase 1: `react-native-purchases` config plugin, dev client build, `ios.buildNumber` (also backlog P0)
- Phase 2: ASC subscription products, `appl_` key
- Phase 7: StoreKit sandbox verification
- Manage subscription → real App Store link (subscription screen placeholder alert today)
- Manual test checklist — [PAYMENTS_PLACEHOLDER.md](PAYMENTS_PLACEHOLDER.md) P6 if still relevant

