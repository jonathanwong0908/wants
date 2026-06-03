import { z } from "zod";

export const ITEM_NAME_MAX_LENGTH = 50;
export const PRESET_DELAY_HOURS = [24, 72, 168] as const;
export const DEFAULT_DELAY_HOURS = 72;
export const DEFAULT_CURRENCY_CODE = "USD";

const NOTE_MAX_LENGTH = 500;

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

export function createItemFormSchema(currencyCode: string) {
  const fractionDigits = getCurrencyFractionDigits(currencyCode);

  return z.object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(ITEM_NAME_MAX_LENGTH, `Name must be at most ${ITEM_NAME_MAX_LENGTH} characters`),
    price: z
      .string()
      .trim()
      .min(1, "Price is required")
      .refine((val) => parsePriceString(val) !== null, {
        message: "Enter a valid price",
      })
      .refine((val) => {
        const n = parsePriceString(val);
        return n !== null && n >= 0;
      }, {
        message: "Price cannot be negative",
      })
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
      .positive("Delay must be at least 1 hour"),
    note: z
      .string()
      .trim()
      .max(NOTE_MAX_LENGTH, `Note must be at most ${NOTE_MAX_LENGTH} characters`)
      .default(""),
  });
}

export type ItemFormInput = z.input<ReturnType<typeof createItemFormSchema>>;
export type ItemFormValues = z.output<ReturnType<typeof createItemFormSchema>>;
