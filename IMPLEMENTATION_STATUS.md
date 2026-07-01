# Wants — Implementation Status

Last updated: 2026-06-29

Agent-readable tracker of what is implemented vs. deferred. See [prd.md](prd.md) for product intent.

**Payments / Apple / RevenueCat:** [PAYMENTS_SETUP.md](PAYMENTS_SETUP.md) (Phases 0a–7). Not listed below.

---

## Remaining work — non-payments (prioritized)

Tick off as you complete them. Safe to implement without Apple sandbox or StoreKit.

### P0 — Before TestFlight / App Store

- [x] **Privacy Policy + Terms URLs** — `PRIVACY_POLICY_URL` / `TERMS_OF_USE_URL` in `src/constants/legal-links.ts`; About rows + paywall footer via `src/components/legal/legal-links.tsx`
- [ ] **Hosted legal pages** — fill `[CONTACT EMAIL]`, jurisdiction placeholders in `docs/legal/` and publish at kloobel.com URLs
- [x] **`ios.buildNumber` in `app.json`** — required for EAS / App Store uploads alongside `version`
- [x] **EAS production env** — `EXPO_PUBLIC_APP_ENV=production`, `EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_…`
- [x] **TestFlight QA** — production-profile build tested on device (purchase flow, core loop)

### P1 — Product polish (no payments dependency)

- [x] **About screen legal links** — Privacy / Terms rows on About; shared `LegalLinkSettingsRows` / `openLegalLink`
- [x] **Custom waiting periods (Pro)** — days picker (1–30), Add/Edit/Settings default; paywall gate on Custom… (`src/components/wants/custom-delay-picker.tsx`)
- [x] **iOS 64-notification prioritization** — when active waiting items exceed iOS local schedule cap, prioritize soonest `notifyAt` (`src/lib/notifications.ts`, reconciliation hooks)

### P2 — Optional for v1

- [ ] **Delete from want detail** — delete only on edit screen today (`src/app/want/[id].tsx`)
- [ ] **Refresh this file** — keep screen-by-screen sections in sync as items ship

### P0 — App Store Connect metadata (in progress)

See **[App Store Connect metadata](#app-store-connect-metadata)** below for copy suggestions. Tick as you complete in ASC.

- [ ] **Screenshots** — 6.7" iPhone set (required); optional 6.5" / iPad if targeting tablet
- [ ] **App name + subtitle** — name: Wants; subtitle ≤ 30 chars
- [ ] **Description + promotional text** — see suggested copy below
- [ ] **Keywords** — 100-char limit, comma-separated, no spaces after commas
- [ ] **Support URL** — required (e.g. `https://kloobel.com/apps/wants/support` or mailto/support page)
- [ ] **Privacy Policy URL** — must match in-app link
- [ ] **Category** — primary + optional secondary (see suggestions)
- [ ] **Age rating questionnaire** — complete in ASC
- [ ] **App Privacy (nutrition labels)** — align with `docs/legal/privacy-policy.md`
- [ ] **IAP metadata** — `wants_pro_unlock` display name, description, review screenshot
- [ ] **Review notes** — sandbox tester steps for Apple (see below)
- [ ] **What's New** — version 1.0 release notes

### P3 — Defer (not payments; not app code now)

- Android `package` + parity — PRD: iOS first
- PostHog analytics — PRD: optional v2
- PRD divergences (past rows tappable) — intentional unless you change UX
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
- Custom delay (Pro): **Custom…** in delay dropdown → days picker (1–30) modal; free → paywall

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
- Pro custom default delay via same Custom… picker; free downgrade falls back to preset default for prefill (`getEffectiveDefaultDelayHours`)
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
- Benefits copy (unlimited items, custom waiting periods, premium themes), single lifetime unlock price from RevenueCat offerings
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

PRD enforcement: FAB (second want), premium theme, Custom delay selection. v1 ships all three.

### RevenueCat — done (Test Store + StoreKit sandbox)

**Files:** `src/contexts/purchases-context.tsx`, `src/lib/purchases.ts`, `src/hooks/use-is-pro.ts`

- `PurchasesProvider` + `usePurchases()` / `useIsPro()` — configure, offerings, purchase, restore, foreground refresh
- Entitlement `pro` mirrored to kv-store `is_pro`
- Gates: Home FAB + add-want, premium theme selection
- Dev-only Toggle Pro on Home (`!isProduction`)
- Paywall + Subscription settings wired to RevenueCat
- **Expo Go:** Test Store (`test_` key)
- **EAS preview build:** StoreKit sandbox verified on physical device (Jun 2026); sandbox Apple ID under **Settings → Developer → Sandbox Apple Account** (iOS 18+)

### Not done (payments — pre-release)

- App Store submit (TestFlight done; ASC metadata + legal pages in progress)
- IAP review screenshot on ASC for `wants_pro_unlock`
- Optional: Apple Server Notifications → RevenueCat; Phase 7 sandbox edge cases (restore after reinstall, persist)

See [PAYMENTS_SETUP.md](PAYMENTS_SETUP.md) open items.

---

## App Store Connect metadata

Suggested copy for Wants v1.0. Adjust tone to taste; stay accurate to free vs Pro (one active want free; lifetime unlock for unlimited + custom delays + premium themes).

### Listing copy

| Field | Limit | Suggestion |
| ----- | ----- | ---------- |
| **Name** | 30 | Wants |
| **Subtitle** | 30 | Pause before overspending |
| **Promotional text** | 170 | Caught overspending on impulse buys? Log the want, wait, then decide. We remind you when the wait is up. |
| **Description** | 4000 | See block below |
| **Keywords** | 100 | overspending,impulse,spending,savings,budget,shopping,mindful,money,delay,wait |
| **Support URL** | — | `https://kloobel.com/apps/wants/support` (or a page with contact email) |
| **Marketing URL** | optional | `https://kloobel.com/apps/wants` |
| **Copyright** | — | `2026 Kloobel` (or your legal entity) |

**Description (paste into ASC):**

```
Overspending often starts with a quick impulse buy. Wants gives you a pause.

Log what you're thinking of buying, pick a waiting period, and put it out of mind. When the wait is up, we send you a notification — "Still want this?" — so you don't have to remember to check back.

• Push reminders when your wait ends (not another app you have to open on a schedule)
• Track what you decided not to buy and watch your savings add up
• Simple list: upcoming waits, ready-to-decide items, and past decisions
• Your data stays on your device — no account required

FREE
• One active waiting item at a time
• Preset delays: 24 hours, 3 days, or 1 week

WANTS PRO (one-time lifetime unlock)
• Unlimited active waiting items
• Custom waiting periods (1–30 days)
• Premium color themes

Pro is a single lifetime purchase — not a subscription. Restore purchases anytime in Settings.

Privacy-first: want lists and decisions are stored locally on your phone.
```

**What's New (1.0.0):**

```
Initial release. Pause impulse buys before they turn into overspending — log wants, get reminded, track what you saved.
```

### Category

| | Suggestion | Rationale |
| --- | --- | --- |
| **Primary** | Lifestyle | Mindful spending / habit, not a full finance suite |
| **Secondary** | Finance | Savings angle; optional if Lifestyle feels right alone |

Alternatives: **Productivity** (if you want to emphasize the reminder workflow over money).

### Age rating

Expect **4+** if questionnaire answers reflect: no unrestricted web, no social, no gambling, purchases behind IAP/parental gates. Answer honestly for in-app purchase and user-generated content (item names/notes stored locally).

### App Privacy (nutrition labels)

Align labels with [docs/legal/privacy-policy.md](docs/legal/privacy-policy.md):

| Data type | Linked to user? | Used for tracking? | Notes |
| --------- | --------------- | ------------------- | ----- |
| **Purchase history** | No (or Not linked — RC/Apple handle IAP) | No | Via Apple IAP / RevenueCat for entitlement only |
| **Product interaction** | No | No | Optional if ASC asks about on-device analytics — you have none |
| **User content** | No | No | Item names, notes, prices — stored on device only, not collected by you |
| **Identifiers** | Check RC docs | No | RevenueCat may use device/anonymous IDs for purchases — declare per RC + Apple guidance |

No data collected for tracking; no third-party advertising. Push notifications are local scheduling, not remote push from your servers.

### In-app purchase (`wants_pro_unlock`)

| Field | Suggestion |
| ----- | ---------- |
| **Reference name** | Wants Pro — Lifetime Unlock |
| **Display name** | Wants Pro |
| **Description** | Unlimited waiting items, custom waiting periods (1–30 days), and premium color themes. One-time purchase. |
| **Review screenshot** | Paywall screen showing lifetime price and benefits |
| **Review notes** | Non-consumable; restore via Settings → Purchase → Restore purchases |

### Screenshots (story order + copy)

Designed frames: real app UI in a device mockup + short headline/subcopy. Use **overspending** on frames 1 and 4 only — skip where it would sound stuffed.

| # | Screen | Headline | Subcopy |
| - | ------ | -------- | ------- |
| 1 | Home — savings hero + upcoming want | Pause overspending | Wait before you buy. |
| 2 | Add want — name, price, delay | Log it fast | Name, price, delay. |
| 3 | Decision — ready to decide + actions | We remind you | No need to check back. |
| 4 | Home or Total saved — skipped / savings | Less overspending | Every skip counts. |
| 5 | Settings → Theme — premium palettes | Premium themes | With Wants Pro. |
| 6 | Paywall — lifetime price visible | Wants Pro | Pay once. Unlock all. |

**Headline-only fallback** (tight layouts): Frame 1 **Pause overspending** · 2 **Log it fast** · 3 **We remind you** · 4 **Less overspending** · 5 **Premium themes** · 6 **Pay once**

Use 6.7" (1290×2796) or Apple's current required size for iPhone 15 Pro Max class devices.

### Review notes (for App Store Review)

Paste into **App Review Information → Notes**:

```
Wants is a local-only impulse-buy delay app. No login.

To test Pro (optional):
1. Open app → complete onboarding (allow notifications if prompted).
2. Add one waiting item (free tier allows one active want).
3. Tap + again → paywall appears (free limit).
4. Purchase "Wants Pro" (sandbox) OR use Settings → Purchase → Restore if already purchased.
5. After Pro: add multiple items; Settings → Theme → select a premium theme; Add/Edit → Custom delay.

Restore: Settings → Purchase → Restore purchases.

All want data is stored on-device (SQLite). Clear via Settings → Data → Clear all data.
```

Add a **sandbox Apple ID** in Review Information if Apple requests it for IAP testing.

