import type {
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";

import { findPackageForPlan } from "@/lib/purchases";
import {
  getPaywallPlan,
  PAYWALL_PLAN_IDS,
  type PaywallPlanId,
} from "@/lib/paywall-placeholder-offerings";

export type PaywallPlanDisplay = {
  id: PaywallPlanId;
  tabLabel: string;
  ctaLabel: string;
  title: string;
  priceString: string | null;
  priceDescription: string | null;
  subtitle?: string;
  pkg: PurchasesPackage | null;
};

function formatPriceDescription(
  planId: PaywallPlanId,
  priceString: string
): string {
  switch (planId) {
    case "monthly":
      return `Subscribe for ${priceString} per month`;
    case "annual":
      return `Subscribe for ${priceString} per year`;
    case "lifetime":
      return `Pay once for ${priceString}`;
  }
}

function computeAnnualSavingsSubtitle(
  monthlyPkg: PurchasesPackage | undefined,
  annualPkg: PurchasesPackage | undefined
): string | undefined {
  if (!monthlyPkg || !annualPkg) {
    return undefined;
  }

  const monthlyAnnualized = monthlyPkg.product.price * 12;
  const annualPrice = annualPkg.product.price;
  if (monthlyAnnualized <= 0 || annualPrice <= 0) {
    return undefined;
  }

  const savings = Math.round(
    ((monthlyAnnualized - annualPrice) / monthlyAnnualized) * 100
  );
  if (savings <= 0) {
    return undefined;
  }

  return `Save ${savings}%`;
}

export function buildPaywallPlans(
  offerings: PurchasesOfferings | null
): PaywallPlanDisplay[] {
  const monthlyPkg = offerings
    ? findPackageForPlan(offerings, "monthly")
    : undefined;
  const annualPkg = offerings
    ? findPackageForPlan(offerings, "annual")
    : undefined;

  return PAYWALL_PLAN_IDS.map((id) => {
    const config = getPaywallPlan(id);
    const pkg = offerings ? (findPackageForPlan(offerings, id) ?? null) : null;
    const priceString = pkg?.product.priceString ?? null;
    const priceDescription = priceString
      ? formatPriceDescription(id, priceString)
      : null;
    const subtitle =
      id === "annual"
        ? computeAnnualSavingsSubtitle(monthlyPkg, annualPkg)
        : undefined;

    return {
      id,
      tabLabel: config.tabLabel,
      ctaLabel: config.ctaLabel,
      title: config.title,
      priceString,
      priceDescription,
      subtitle,
      pkg,
    };
  });
}

export function getPaywallPlanDisplay(
  plans: PaywallPlanDisplay[],
  id: PaywallPlanId
): PaywallPlanDisplay {
  const plan = plans.find((entry) => entry.id === id);
  if (!plan) {
    throw new Error(`Unknown paywall plan: ${id}`);
  }
  return plan;
}
