import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";
import Purchases, {
  type CustomerInfo,
  type PurchasesOfferings,
  type PurchasesPackage,
} from "react-native-purchases";

import { env, isProduction } from "@/lib/env";

export const PRO_ENTITLEMENT_ID = "pro";

let configured = false;

export function isExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

function isTestStoreKey(key: string): boolean {
  return key.startsWith("test_") || key.startsWith("rcb_");
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
  if (isProduction) {
    const key = getPlatformRevenueCatKey();
    if (!key) {
      throw new Error(
        `Missing RevenueCat production API key for ${Platform.OS}. Set EXPO_PUBLIC_REVENUECAT_${Platform.OS === "ios" ? "IOS" : "ANDROID"}_KEY.`
      );
    }
    if (isTestStoreKey(key)) {
      throw new Error(
        "RevenueCat Test Store API keys cannot be used in production builds."
      );
    }
    return key;
  }

  if (env.revenueCatTestKey) {
    return env.revenueCatTestKey;
  }

  const platformKey = getPlatformRevenueCatKey();
  if (platformKey) {
    return platformKey;
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
