import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";
import Purchases, {
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesOfferings,
  type PurchasesPackage,
} from "react-native-purchases";

import { env, isProduction } from "@/lib/env";
import type { PaywallPlanId } from "@/lib/paywall-placeholder-offerings";
import { writeIsPro, writeProPlan } from "@/lib/pro-status";

export const PRO_ENTITLEMENT_ID = "pro";
export const DEFAULT_OFFERING_ID = "default";

const PRODUCT_ID_TO_PLAN: Record<string, PaywallPlanId> = {
  wants_pro_monthly: "monthly",
  wants_pro_annual: "annual",
  wants_pro_lifetime: "lifetime",
};

const PLAN_TO_PACKAGE_TYPE: Record<
  PaywallPlanId,
  "MONTHLY" | "ANNUAL" | "LIFETIME"
> = {
  monthly: "MONTHLY",
  annual: "ANNUAL",
  lifetime: "LIFETIME",
};

const PLAN_TO_PACKAGE_IDENTIFIERS: Record<PaywallPlanId, string[]> = {
  monthly: ["$rc_monthly", "monthly", "rc_monthly"],
  annual: ["$rc_annual", "annual", "rc_annual"],
  lifetime: ["$rc_lifetime", "lifetime", "rc_lifetime"],
};

let configured = false;

export function isExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

function isTestStoreKey(key: string): boolean {
  return key.startsWith("test_") || key.startsWith("rcb_");
}

/** Test Store keys are only valid in Expo Go or JS debug builds — not EAS preview/release. */
export function canUseTestStoreKey(): boolean {
  return isExpoGo() || __DEV__;
}

function getPlatformRevenueCatKey(): string | undefined {
  if (Platform.OS === "ios") {
    return env.revenueCatIosKey;
  }
  if (Platform.OS === "android") {
    return env.revenueCatAndroidKey;
  }
  return undefined;
}

export function getRevenueCatApiKey(): string {
  const platformKey = getPlatformRevenueCatKey();
  const testStoreAllowed = canUseTestStoreKey();

  if (isProduction) {
    if (!platformKey) {
      throw new Error(
        `Missing RevenueCat production API key for ${Platform.OS}. Set EXPO_PUBLIC_REVENUECAT_${Platform.OS === "ios" ? "IOS" : "ANDROID"}_KEY.`
      );
    }
    if (isTestStoreKey(platformKey)) {
      throw new Error(
        "RevenueCat Test Store API keys cannot be used in production builds."
      );
    }
    return platformKey;
  }

  if (testStoreAllowed && env.revenueCatTestKey) {
    return env.revenueCatTestKey;
  }

  if (platformKey) {
    if (isTestStoreKey(platformKey) && !testStoreAllowed) {
      throw new Error(
        `RevenueCat Test Store API keys cannot be used in ${Platform.OS} release/preview native builds. Set EXPO_PUBLIC_REVENUECAT_${Platform.OS === "ios" ? "IOS" : "ANDROID"}_KEY (appl_/goog_) for EAS preview builds.`
      );
    }
    return platformKey;
  }

  if (env.revenueCatTestKey && !testStoreAllowed) {
    throw new Error(
      "RevenueCat Test Store API keys cannot be used in release/preview native builds. Use Expo Go or a development client with EXPO_PUBLIC_REVENUECAT_TEST_KEY, or set EXPO_PUBLIC_REVENUECAT_IOS_KEY for EAS preview builds."
    );
  }

  throw new Error(
    "Missing RevenueCat API key. Set EXPO_PUBLIC_REVENUECAT_TEST_KEY for Test Store development."
  );
}

export function configurePurchases(): void {
  if (configured) {
    return;
  }

  const apiKey = getRevenueCatApiKey();
  Purchases.configure({ apiKey });
  configured = true;
}

export function isPro(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[PRO_ENTITLEMENT_ID]?.isActive === true;
}

export function proPlanFromCustomerInfo(
  customerInfo: CustomerInfo
): PaywallPlanId | null {
  if (!isPro(customerInfo)) {
    return null;
  }

  const productIdentifier =
    customerInfo.entitlements.active[PRO_ENTITLEMENT_ID]?.productIdentifier;
  if (!productIdentifier) {
    return null;
  }

  return PRODUCT_ID_TO_PLAN[productIdentifier] ?? null;
}

/** Prefer `current`, then `default`, then any offering with packages. */
export function getActiveOffering(
  offerings: PurchasesOfferings
): PurchasesOffering | null {
  if (offerings.current?.availablePackages.length) {
    return offerings.current;
  }

  const defaultOffering = offerings.all[DEFAULT_OFFERING_ID];
  if (defaultOffering?.availablePackages.length) {
    return defaultOffering;
  }

  return (
    Object.values(offerings.all).find(
      (offering) => offering.availablePackages.length > 0
    ) ?? null
  );
}

export function findPackageForPlan(
  offerings: PurchasesOfferings,
  planId: PaywallPlanId
): PurchasesPackage | undefined {
  const offering = getActiveOffering(offerings);
  if (!offering) {
    return undefined;
  }

  const offeringPackage =
    planId === "monthly"
      ? offering.monthly
      : planId === "annual"
        ? offering.annual
        : offering.lifetime;
  if (offeringPackage) {
    return offeringPackage;
  }

  const productId = Object.entries(PRODUCT_ID_TO_PLAN).find(
    ([, id]) => id === planId
  )?.[0];
  if (productId) {
    const byProductId = offering.availablePackages.find(
      (pkg) => pkg.product.identifier === productId
    );
    if (byProductId) {
      return byProductId;
    }
  }

  const packageIdentifiers = PLAN_TO_PACKAGE_IDENTIFIERS[planId];
  const byPackageId = offering.availablePackages.find((pkg) =>
    packageIdentifiers.includes(pkg.identifier)
  );
  if (byPackageId) {
    return byPackageId;
  }

  const packageType = PLAN_TO_PACKAGE_TYPE[planId];
  return offering.availablePackages.find(
    (pkg) => pkg.packageType === packageType
  );
}

export function describeOfferingsState(offerings: PurchasesOfferings): string {
  const active = getActiveOffering(offerings);
  const offeringIds = Object.keys(offerings.all);
  const packageSummary = active
    ? active.availablePackages
        .map((pkg) => `${pkg.identifier}:${pkg.product.identifier}`)
        .join(", ")
    : "none";

  return [
    `current=${offerings.current?.identifier ?? "null"}`,
    `active=${active?.identifier ?? "null"}`,
    `all=[${offeringIds.join(", ")}]`,
    `packages=[${packageSummary}]`,
  ].join("; ");
}

export function syncProStatusFromCustomerInfo(customerInfo: CustomerInfo): {
  isPro: boolean;
  proPlan: PaywallPlanId | null;
} {
  const nextIsPro = isPro(customerInfo);
  const nextProPlan = proPlanFromCustomerInfo(customerInfo);

  writeIsPro(nextIsPro);
  writeProPlan(nextProPlan);

  return { isPro: nextIsPro, proPlan: nextProPlan };
}

export function isPurchaseCancelledError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
  );
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo();
}

export async function getOfferings(): Promise<PurchasesOfferings> {
  return Purchases.getOfferings();
}

export async function purchasePackage(
  packageToPurchase: PurchasesPackage
): Promise<CustomerInfo> {
  const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
  return customerInfo;
}

export async function restorePurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}
