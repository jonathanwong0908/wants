# PRD — Wants (Impulse Buy Delay App)

**Version:** 1.4  
**Stack:** React Native · Expo · Expo Router · expo-sqlite · Drizzle ORM · expo-notifications · RevenueCat · lucide-react-native  
**Target platforms:** iOS first, Android parity  
**Author reference:** Use this document as the single source of truth when building Wants. DB schema and folder structure are decided at implementation time.

---

## 1. Product summary

Wants is an impulse-buy delay app. When a user wants to buy something, they log the item and a waiting period. After the delay expires, a push notification asks "Still want this?" The user taps Yes or No. Every "No" is counted as money saved. The core emotional hook is the accumulating savings total — showing users how much they've stopped themselves from spending.

**The critical UX difference from competitors:** Wants is push-first. Every existing competitor requires the user to open the app and check in. Wants sends the notification to them. The user does not need to remember anything.

---

## 2. Tech stack


| Layer            | Choice                                   |
| ---------------- | ---------------------------------------- |
| Framework        | React Native via Expo (managed workflow) |
| Navigation       | Expo Router (file-based, v3+)            |
| Local DB         | expo-sqlite + Drizzle ORM                |
| Notifications    | expo-notifications                       |
| State management | Zustand                                  |
| Payments         | RevenueCat (react-native-purchases)      |
| Icons            | hugeicons-react-native                   |
| Analytics        | PostHog (v2, optional)                   |


**Key constraint:** All data is stored locally on device. No backend, no user accounts in v1. This is intentional — it's a strong privacy and trust signal.

**Important:** All technical details in this document (library choices, API names, configuration) are for reference and direction only. Final decisions on implementation details should be made during development after reading the relevant library documentation thoroughly. Do not treat any technical detail here as a prescription.

---

## 3. Data model (conceptual — schema decided at implementation)

### Item

The core entity. One row per thing the user wants to buy.


| Field      | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| id         | Unique identifier                                               |
| name       | What the user wants to buy                                      |
| price      | Numeric amount                                                  |
| currency   | ISO currency code (e.g. USD, JPY) — stored per item, not global |
| delayHours | Waiting period in hours; presets 24 / 72 / 168; Pro may set custom (1–30 days) |
| notifyAt   | Timestamp when the notification fires                           |
| notifId    | expo-notifications identifier, for cancellation                 |
| status     | `waiting` · `skipped` · `bought`                                |
| createdAt  | When the item was logged                                        |
| decidedAt  | When the user made their decision (null until decided)          |
| note       | Optional free-text note                                         |


### Settings

Key-value store for user preferences.


| Key                   | Description                                                                                                                                          | Default       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `default_delay_hours` | Pre-filled delay on Add screen; presets for free; Pro may store a custom default (24–720 hours)                                                      | `72`          |
| `currency`            | User's currency, auto-detected from device locale on first run                                                                                       | device locale |
| `onboarding_complete` | Whether onboarding has been completed                                                                                                                | `false`       |
| `is_pro`              | Whether user has active RevenueCat entitlement                                                                                                       | `false`       |


---

## 4. Currency handling

- Currency is stored **per item** at the time of logging. It never changes retroactively.
- The user sets their currency once in Settings. New items inherit this currency.
- Currency is **auto-detected from device locale** on first run using `expo-localization`. The user can change it in Settings at any time.
- All prices are stored as plain numbers. Formatting happens at display time only, using `Intl.NumberFormat`.
- The savings total only sums items matching the **current currency setting**. Items in other currencies are excluded; tap the Home savings hero for a per-currency breakdown on the Total saved screen.
- Zero-decimal currencies (JPY, KRW, VND, etc.) must use integer-only price input and no decimal formatting.

---

## 5. Navigation structure

No tab bar. The app is a stack of screens navigated by buttons and links.

- **Onboarding stack** (Welcome → Social proof → How it works → Notification permission): shown on first run, gated by `onboarding_complete` setting
- **Home** is the root screen after onboarding
- All other screens are pushed onto the stack or presented as modals from Home
- **Modals:** Add item, Decision screen, All items, Paywall, Settings

---

## 6. Screens

### S1 — Welcome

- Full-screen, no navigation chrome
- App name + tagline: **Wants** — "Wait before you buy."
- Subtext: "Log what you want. Wait. See if you still need it."
- CTA: "Get started" → Social proof (S2)
- No Skip on this screen (Skip may appear on a later onboarding step once that flow is built)
- Respects device safe areas (notch / home indicator)

### S2 — Social proof *(onboarding)*

- Purpose: emotional anchor before the how-it-works explainer
- Full-screen, no navigation chrome; respects device safe areas (same as Welcome)
- Headline fact (approximate wording, not a precise statistical claim): "Around 65% of impulse spenders regret a spur-of-the-moment purchase."
- Supporting line connecting regret to the product: waiting creates a pause before a purchase turns into regret — e.g. "Wants gives you a pause — log what you want, wait, then decide with a clear head."
- Optional short line previewing the next step: "Up next: how Wants works"
- CTA: "Continue" → How it works (S3)

### S3 — How it works

- 3-step explainer (swiper or stacked cards):
  1. **Log it** — add the item and a waiting period
  2. **We remind you** — after the delay, we send a notification
  3. **Decide** — still want it? Buy guilt-free. Changed your mind? Watch your savings grow.
- "Next" → S4 (Notification permission)

### S4 — Notification permission

- Explains why notifications are needed: "This is how Wants works — we ping you when your wait is up so you don't have to remember anything."
- CTA: "Allow notifications" → triggers system permission prompt
- On allow or deny: mark onboarding complete, navigate to Home
- If denied: soft warning ("You can enable this in Settings later") but do not block

### S5 — Home

- **Top bar:** app name left, settings icon (lucide) right → opens Settings
- **Savings hero:** large formatted total saved. Label: "saved so far" (or "saved so far in {settings currency}" when skipped items exist in other currencies). Subtext shows item count: "across X decisions". Tappable → Total saved screen; chevron beside the amount indicates navigation.
- **Ready to decide section** (shown only when expired waiting items exist):
  - Header: "Ready to decide"
  - All waiting items where `notifyAt` has passed, ordered by `notifyAt` ascending
  - Each item card: name, price, "Ready to decide" badge. Tappable → Decision screen
- **Upcoming section:**
  - Header: "Upcoming" + "Show all →" link on the right → navigates to All Items screen
  - Shows **all** not-yet-expired waiting items, ordered by `notifyAt` ascending
  - Each item card: name, price, countdown timer. Tappable → Decision screen
  - Empty state if no upcoming items: "Nothing waiting. Add something you're eyeing."
- **Floating action button** (bottom-right): "+" icon → opens Add item modal
- **Notification permission banner** (shown if permission denied and waiting items exist): "Notifications are off — check back here manually." Dismissible.
- **Free tier gate:** if waiting items ≥ 1 and not pro, FAB shows lock icon and opens paywall

### S5b — Total saved

- Reached by tapping the savings hero on Home
- Stack screen (back button returns to Home)
- Summary: "across X decisions" (all skipped items, any currency)
- Per-currency rows: currency code, formatted total saved, decision count per currency. Settings currency row labeled "Your currency" when multiple currencies exist.
- Explainer: savings aren't combined across currencies; Home shows Settings currency only
- Empty state if no skipped items: "Nothing saved yet — skip a want to start."
- No combined cross-currency total and no FX conversion

### S6 — Add item *(modal)*

- Fields: item name (required), price (required), delay picker, optional note
- Delay picker options: 24h / 3 days / 1 week, plus **Custom…** (Pro) — days picker (1–30 days); live preview of decide-on date
- Default delay pre-filled from settings
- On submit: schedule notification, save item, dismiss modal
- **Free tier gate on Add screen:** if waiting items ≥ 1 and not pro, block adding and open paywall.

### S7 — Push notification *(system notification, not a screen)*

- Fires at `notifyAt`
- Title: "Still want this?"
- Body: "You added [name] ([price]). Still feeling it?"
- Tapping deep-links to the Decision screen for that item

### S8 — Decision screen *(modal)*

- Reached by: tapping a notification, or tapping any waiting or expired item card
- Show item details (name, price, wait period, dates, note) and countdown or "Ready to decide" status
- Decision buttons are **always shown** for waiting items — including before the timer expires (early check-in allowed)
- Two buttons:
  - "Nope, I moved on" (primary) → skip
  - "Yeah, I'll buy it" (secondary) → buy
- Skipping: update status to `skipped`, cancel notification, dismiss modal (return to previous screen)
- Buying: update status to `bought`, cancel notification, dismiss modal (return to previous screen). Buy may use a confirmation step at implementation time.

### S11 — All items

- Reached from "Show all →" on Home
- Filter tabs: Upcoming / Past (default: Upcoming)
- **Upcoming tab:** all items with `status = waiting`, ordered by `notifyAt` ascending. Each card shows name, price, countdown or "Ready to decide" badge. Tappable → Decision screen.
- **Past tab:** all items with `status = skipped` or `bought`, ordered by `decidedAt` descending. Each row shows name, price, status badge (Saved / Bought), date decided.
- Summary row at top of Past tab: "[X] skipped · [Y] bought · [total] saved"

### S12 — Settings *(modal or pushed screen)*

- **Defaults:** default delay picker (presets for free; presets + Custom for Pro), currency picker
- **Notifications:** status indicator + link to system settings if permission denied
- **Theme:** Light and Dark (default palette); premium color palettes for Pro — sub-page with selectable themes
- **Account:** "Upgrade to Pro" (if not pro) / subscription status (if pro) / link to Subscription sub-screen / restore purchases
- **Data:** export to CSV (all items); import from CSV (replace or merge when data exists; settings unchanged); "Clear all data" (confirmation dialog, destructive)
- **About:** version number, privacy policy link, terms link

### S13 — Paywall *(modal)*

- Headline: "Upgrade to Pro"
- Body copy: free tier limit (one active want) and Pro benefits (unlimited items, custom waiting periods, premium themes)
- Three plan tabs: Monthly · Annual (default) · Lifetime
- Prices loaded dynamically from RevenueCat (`product.priceString`) — never hardcoded in production; static copy (tab labels, CTAs) lives in `paywall-placeholder-offerings.ts`
- Annual tab may show a computed savings subtitle when monthly and annual packages are both available
- CTA: "Subscribe" on monthly; "Subscribe annually" on annual; "Unlock lifetime access" on lifetime
- Dismiss via modal close button
- Restore purchases: Subscription settings screen only (not on paywall)
- Legal footer: subscription terms, Privacy Policy and Terms of Use links

---

## 7. Notification behaviour

- One notification scheduled per item at `notifyAt` (exact delay expiry — e.g. item logged at 6pm with a 3-day delay fires at 6pm three days later)
- Notification is cancelled immediately when user makes a decision (skip or buy)
- On app foreground: check for waiting items where `notifyAt < now` — show "Ready to decide" badge. Handles missed/dismissed notifications and permission-denied scenarios.
- If notification permission is denied and waiting items exist: show non-blocking banner on Home.

---

## 8. Free vs pro


| Feature              | Free                          | Pro                     |
| -------------------- | ----------------------------- | ----------------------- |
| Active waiting items | Max 1                         | Unlimited               |
| Delay options        | 24h, 3 days, 1 week           | Presets + custom (1–30 days picker) |
| Past items history   | All time                      | All time                |
| Color themes         | Light, Dark (default palette) | + Premium color palettes |


Enforcement points (nowhere else):

1. FAB on Home — locked if waiting items ≥ 1 and not pro
2. Theme settings — selecting a premium color palette when not pro opens the paywall
3. Custom delay — selecting **Custom…** on Add item, Edit want, or Settings default delay when not pro opens the paywall

`is_pro` is read from the settings table, synced from RevenueCat on app foreground. RevenueCat entitlement name: `pro`.

---

## 9. Edge cases

- **App killed before notification fires:** expo-notifications persists scheduled notifications across restarts — no action needed.
- **User revokes notification permission:** App works without notifications. Show banner on Home. Check permission status on every foreground event.
- **User changes phone date/time:** On app open, re-check all waiting items. Any with `notifyAt < now` show "Ready to decide" immediately.
- **Item price is 0:** Allowed — some free items are still worth tracking.
- **Very long item names:** Cap input at 50 characters. Display with ellipsis in cards.
- **Mixed currencies in history:** Savings total on Home only sums items in Settings currency. Total saved screen lists per-currency breakdown; no footnote on Home.
- **User deletes a skipped item:** Hard-delete from Edit Want. Savings total (same currency) and skipped count decrease; item removed from Past tab. Irreversible — no status reversal to waiting or bought.
- **No items ever logged:** Show empty state on Home.

---

## 10. Versioning

**v1 — MVP (this document):** Full core loop, local storage only, free + pro tiers via RevenueCat.

**v2:** Share card ("I saved $X this month"), home screen widget, iCloud backup, savings chart on a dedicated screen.

**v3:** No-buy streak, recurring item templates.

---

## 11. Terminology


| Term            | Meaning                                              |
| --------------- | ---------------------------------------------------- |
| Item            | A single purchase the user is considering            |
| Delay           | The waiting period in hours                          |
| Waiting         | Item logged, timer running                           |
| Skipped         | User decided not to buy — counts toward savings      |
| Bought          | User decided to buy — logged, not counted as savings |
| Savings total   | Sum of all skipped item prices in current currency   |
| Total saved screen | Per-currency breakdown of skipped savings; opened from Home hero |
| Notify at       | Timestamp when the push notification fires           |
| Decision screen | Where the user chooses skip or buy                   |
| Pro             | Paid subscription tier                               |


