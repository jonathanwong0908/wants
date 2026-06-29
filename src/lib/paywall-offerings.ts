import type {
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";

import { findProPackage } from "@/lib/purchases";

export type ProOfferingDisplay = {
  priceString: string | null;
  priceDescription: string | null;
  pkg: PurchasesPackage | null;
};

export function buildProOffering(
  offerings: PurchasesOfferings | null
): ProOfferingDisplay {
  const pkg = offerings ? (findProPackage(offerings) ?? null) : null;
  const priceString = pkg?.product.priceString ?? null;
  const priceDescription = priceString
    ? `Pay once for ${priceString}`
    : null;

  return {
    priceString,
    priceDescription,
    pkg,
  };
}
