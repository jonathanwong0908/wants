export type PaywallPlanId = "monthly" | "annual" | "lifetime";

export type PaywallPlanConfig = {
  id: PaywallPlanId;
  tabLabel: string;
  title: string;
  ctaLabel: string;
};

export const PAYWALL_BENEFITS = [
  "Unlimited waiting items",
  "Premium color themes",
] as const;

export const PAYWALL_PLAN_IDS: PaywallPlanId[] = [
  "monthly",
  "annual",
  "lifetime",
];

export const PAYWALL_PLAN_CONFIG: PaywallPlanConfig[] = [
  {
    id: "monthly",
    tabLabel: "Monthly",
    title: "Monthly",
    ctaLabel: "Subscribe",
  },
  {
    id: "annual",
    tabLabel: "Annual",
    title: "Annual",
    ctaLabel: "Subscribe annually",
  },
  {
    id: "lifetime",
    tabLabel: "Lifetime",
    title: "Lifetime",
    ctaLabel: "Unlock lifetime access",
  },
];

export const DEFAULT_PLAN_ID: PaywallPlanId = "annual";

export function getPaywallPlan(id: PaywallPlanId): PaywallPlanConfig {
  const plan = PAYWALL_PLAN_CONFIG.find((entry) => entry.id === id);
  if (!plan) {
    throw new Error(`Unknown paywall plan: ${id}`);
  }
  return plan;
}
