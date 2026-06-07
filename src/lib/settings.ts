import Storage from "expo-sqlite/kv-store";
import { getLocales } from "expo-localization";

import {
  CURRENCY_KEY,
  DEFAULT_DELAY_HOURS_KEY,
} from "@/constants/storage-keys";
import { CURRENCY_OPTIONS } from "@/lib/currency";
import {
  DEFAULT_CURRENCY_CODE,
  DEFAULT_DELAY_HOURS,
  PRESET_DELAY_HOURS,
} from "@/lib/forms/item-form-schema";

const SUPPORTED_CURRENCY_CODES = new Set(
  CURRENCY_OPTIONS.map((option) => option.value)
);

function isPresetDelayHours(hours: number): hours is (typeof PRESET_DELAY_HOURS)[number] {
  return (PRESET_DELAY_HOURS as readonly number[]).includes(hours);
}

function isSupportedCurrencyCode(code: string): boolean {
  return SUPPORTED_CURRENCY_CODES.has(code);
}

export function readDefaultDelayHours(): number {
  const raw = Storage.getItemSync(DEFAULT_DELAY_HOURS_KEY);
  if (raw == null) {
    return DEFAULT_DELAY_HOURS;
  }

  const hours = Number.parseInt(raw, 10);
  if (!Number.isFinite(hours) || !isPresetDelayHours(hours)) {
    return DEFAULT_DELAY_HOURS;
  }

  return hours;
}

export function writeDefaultDelayHours(hours: number): void {
  if (!isPresetDelayHours(hours)) {
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
}

export function readSettingsFromStorage(): {
  currencyCode: string;
  defaultDelayHours: number;
} {
  return {
    currencyCode: readCurrencyCode(),
    defaultDelayHours: readDefaultDelayHours(),
  };
}
