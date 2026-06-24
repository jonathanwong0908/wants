import {
  getPaywallPlan,
  type PaywallPlanId,
} from "@/lib/paywall-placeholder-offerings";

export function getSubscriptionHubLabel(
  isPro: boolean,
  proPlan: PaywallPlanId | null
): string {
  if (!isPro) return "Free";
  if (proPlan) return getPaywallPlan(proPlan).title;
  return "Pro";
}

export function getSubscriptionStatusTitle(
  isPro: boolean,
  proPlan: PaywallPlanId | null
): string {
  if (!isPro) return "Free plan";
  switch (proPlan) {
    case "lifetime":
      return "Lifetime Pro — no renewal";
    case "monthly":
    case "annual":
      return "Wants Pro — active";
    default:
      return "Wants Pro — active";
  }
}
