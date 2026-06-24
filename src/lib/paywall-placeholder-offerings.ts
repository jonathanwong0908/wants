export type PaywallPlanId = "monthly" | "annual" | "lifetime";

export type PaywallPackageType = "MONTHLY" | "ANNUAL" | "LIFETIME";

export type PaywallPlan = {
  id: PaywallPlanId;
  packageType: PaywallPackageType;
  tabLabel: string;
  title: string;
  priceAmount: string;
  priceDescription: string;
  subtitle?: string;
  highlighted?: boolean;
  ctaLabel: string;
};

export const PAYWALL_BENEFITS = [
  "Unlimited waiting items",
  "Custom delays",
  "Premium color themes",
] as const;

export const PAYWALL_PLANS: PaywallPlan[] = [
  {
    id: "monthly",
    packageType: "MONTHLY",
    tabLabel: "Monthly",
    title: "Monthly",
    priceAmount: "1.99",
    priceDescription: "Subscribe for $1.99 per month",
    ctaLabel: "Subscribe",
  },
  {
    id: "annual",
    packageType: "ANNUAL",
    tabLabel: "Annual",
    title: "Annual",
    priceAmount: "9.99",
    priceDescription: "Subscribe for $9.99 per year",
    subtitle: "Save 58%",
    highlighted: true,
    ctaLabel: "Subscribe annually",
  },
  {
    id: "lifetime",
    packageType: "LIFETIME",
    tabLabel: "Lifetime",
    title: "Lifetime",
    priceAmount: "19.99",
    priceDescription: "Pay once for lifetime access",
    ctaLabel: "Unlock lifetime access",
  },
];

export const DEFAULT_PLAN_ID: PaywallPlanId = "annual";

export function getPaywallPlan(id: PaywallPlanId): PaywallPlan {
  const plan = PAYWALL_PLANS.find((entry) => entry.id === id);
  if (!plan) {
    throw new Error(`Unknown paywall plan: ${id}`);
  }
  return plan;
}
