import Storage from "expo-sqlite/kv-store";
import { getLocales } from "expo-localization";

import {
  CURRENCY_KEY,
  DEFAULT_DELAY_HOURS_KEY,
} from "@/constants/storage-keys";
import { isSupportedCurrencyCode } from "@/lib/currency";
import {
  DEFAULT_CURRENCY_CODE,
  DEFAULT_DELAY_HOURS,
  isAllowedCustomDelayHours,
  isPresetDelayHours,
} from "@/lib/forms/item-form-schema";
import {
  readThemeId,
  seedInitialThemeIfNeeded,
  writeThemeId,
} from "@/lib/themes/storage";
import type { ThemeId } from "@/lib/themes/types";

function parseStoredDelayHours(raw: string | null): number | null {
  if (raw == null) {
    return null;
  }

  const hours = Number.parseInt(raw, 10);
  if (!Number.isFinite(hours) || hours < 1) {
    return null;
  }

  return hours;
}

export function readDefaultDelayHours(): number {
  const hours = parseStoredDelayHours(
    Storage.getItemSync(DEFAULT_DELAY_HOURS_KEY)
  );

  if (hours == null) {
    return DEFAULT_DELAY_HOURS;
  }

  if (isPresetDelayHours(hours) || isAllowedCustomDelayHours(hours)) {
    return hours;
  }

  return DEFAULT_DELAY_HOURS;
}

export function getEffectiveDefaultDelayHours(
  isPro: boolean,
  stored?: number
): number {
  const hours = stored ?? readDefaultDelayHours();
  if (isPro || isPresetDelayHours(hours)) {
    return hours;
  }

  return DEFAULT_DELAY_HOURS;
}

export function writeDefaultDelayHours(hours: number): void {
  if (!isPresetDelayHours(hours) && !isAllowedCustomDelayHours(hours)) {
    throw new Error(`Invalid default delay hours: ${hours}`);
  }

  Storage.setItemSync(DEFAULT_DELAY_HOURS_KEY, String(hours));
}

export function readCurrencyCode(): string {
  return Storage.getItemSync(CURRENCY_KEY) ?? DEFAULT_CURRENCY_CODE;
}

export function writeCurrencyCode(code: string): void {
  if (!isSupportedCurrencyCode(code)) {
    throw new Error(`Unsupported currency code: ${code}`);
  }

  Storage.setItemSync(CURRENCY_KEY, code);
}

export function hasStoredCurrencyCode(): boolean {
  return Storage.getItemSync(CURRENCY_KEY) != null;
}

export function hasStoredDefaultDelayHours(): boolean {
  return Storage.getItemSync(DEFAULT_DELAY_HOURS_KEY) != null;
}

export function detectDeviceCurrencyCode(): string {
  const code = getLocales()[0]?.currencyCode;
  if (code && isSupportedCurrencyCode(code)) {
    return code;
  }

  return DEFAULT_CURRENCY_CODE;
}

export function seedInitialSettingsIfNeeded(): void {
  if (!hasStoredCurrencyCode()) {
    writeCurrencyCode(detectDeviceCurrencyCode());
  }

  if (!hasStoredDefaultDelayHours()) {
    writeDefaultDelayHours(DEFAULT_DELAY_HOURS);
  }

  seedInitialThemeIfNeeded();
}

export { readThemeId, writeThemeId, type ThemeId };

export function readSettingsFromStorage(): {
  currencyCode: string;
  defaultDelayHours: number;
} {
  return {
    currencyCode: readCurrencyCode(),
    defaultDelayHours: readDefaultDelayHours(),
  };
}
