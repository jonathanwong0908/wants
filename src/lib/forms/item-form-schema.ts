import type { items } from "@/db/schema";
import { isDevelopment, isPreview } from "@/lib/env";
import { z } from "zod";

type Item = typeof items.$inferSelect;

export const ITEM_NAME_MAX_LENGTH = 50;
export const PRESET_DELAY_HOURS = [24, 72, 168] as const;
/** Dev-only sentinel in `delay_hours`: schedules notification in 1 minute. */
export const DEV_ONE_MINUTE_DELAY_HOURS = 0;
export const DEFAULT_DELAY_HOURS = 72;
export const DEFAULT_CURRENCY_CODE = "USD";

export const MAX_CUSTOM_DAYS = 30;
export const MIN_CUSTOM_DELAY_HOURS = 24;
export const MAX_DELAY_HOURS = MAX_CUSTOM_DAYS * 24;
/** Dropdown-only value; opens custom picker. Never persisted. */
export const CUSTOM_DELAY_OPTION_VALUE = "custom";

export function isPresetDelayHours(
  hours: number
): hours is (typeof PRESET_DELAY_HOURS)[number] {
  return (PRESET_DELAY_HOURS as readonly number[]).includes(hours);
}

export function isAllowedCustomDelayHours(hours: number): boolean {
  return (
    Number.isInteger(hours) &&
    hours >= MIN_CUSTOM_DELAY_HOURS &&
    hours <= MAX_DELAY_HOURS
  );
}

export function delayHoursFromDays(days: number): number {
  return days * 24;
}

export function initialCustomPickerDays(hours: number): number {
  return Math.min(MAX_CUSTOM_DAYS, Math.max(1, Math.round(hours / 24)));
}

export function getDelayDurationMs(delayHours: number): number {
  if (delayHours === DEV_ONE_MINUTE_DELAY_HOURS) {
    return 60 * 1000;
  }

  return delayHours * 60 * 60 * 1000;
}

export function computeNotifyAt(base: Date, delayHours: number): Date {
  return new Date(base.getTime() + getDelayDurationMs(delayHours));
}

function formatPresetDelayLabel(
  hours: (typeof PRESET_DELAY_HOURS)[number]
): string {
  switch (hours) {
    case 24:
      return "1 day";
    case 72:
      return "3 days";
    case 168:
      return "1 week";
  }
}

export const DELAY_OPTIONS = PRESET_DELAY_HOURS.map((hours) => ({
  value: String(hours),
  label: formatPresetDelayLabel(hours),
}));

export function getDelayOptionsForForm() {
  if (!isDevelopment && !isPreview) {
    return DELAY_OPTIONS;
  }

  return [
    {
      value: String(DEV_ONE_MINUTE_DELAY_HOURS),
      label: "1 minute (dev)",
    },
    ...DELAY_OPTIONS,
  ];
}

export const NOTE_MAX_LENGTH = 500;

export function getCurrencyFractionDigits(currencyCode: string): number {
  return (
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
    }).resolvedOptions().maximumFractionDigits ?? 2
  );
}

function parsePriceString(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return null;
  }
  const n = Number(trimmed);
  if (!Number.isFinite(n)) {
    return null;
  }
  return n;
}

export function sanitizePriceInput(
  raw: string,
  allowDecimals: boolean
): string {
  const withoutNegatives = raw.replace(/-/g, "");

  if (!allowDecimals) {
    return withoutNegatives.replace(/\D/g, "");
  }

  const digitsAndDots = withoutNegatives.replace(/[^\d.]/g, "");
  const parts = digitsAndDots.split(".");
  if (parts.length <= 1) {
    return digitsAndDots;
  }
  return `${parts[0]}.${parts.slice(1).join("")}`;
}

export function createItemFormSchema(currencyCode: string) {
  const fractionDigits = getCurrencyFractionDigits(currencyCode);

  return z.object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(
        ITEM_NAME_MAX_LENGTH,
        `Name must be at most ${ITEM_NAME_MAX_LENGTH} characters`
      ),
    price: z
      .string()
      .trim()
      .min(1, "Price is required")
      .refine((val) => parsePriceString(val) !== null, {
        message: "Enter a valid price",
      })
      .refine(
        (val) => {
          const n = parsePriceString(val);
          return n !== null && n >= 0;
        },
        {
          message: "Price cannot be negative",
        }
      )
      .refine(
        (val) => {
          if (fractionDigits > 0) {
            return true;
          }
          const n = parsePriceString(val);
          return n !== null && Number.isInteger(n);
        },
        {
          message: "Enter a whole number for this currency",
        }
      )
      .transform((val) => parsePriceString(val)!),
    delayHours: z
      .number()
      .int("Delay must be a whole number of hours")
      .refine(
        (hours) =>
          hours === DEV_ONE_MINUTE_DELAY_HOURS ? isDevelopment : hours >= 1,
        { message: "Delay must be at least 1 hour" }
      ),
    note: z
      .string()
      .trim()
      .max(
        NOTE_MAX_LENGTH,
        `Note must be at most ${NOTE_MAX_LENGTH} characters`
      )
      .default(""),
  });
}

export type ItemFormInput = z.input<ReturnType<typeof createItemFormSchema>>;
export type ItemFormValues = z.output<ReturnType<typeof createItemFormSchema>>;

export function itemToFormDefaultValues(item: Item): Partial<ItemFormInput> {
  return {
    name: item.name,
    price: String(item.price),
    delayHours: item.delayHours,
    note: item.note ?? "",
  };
}
