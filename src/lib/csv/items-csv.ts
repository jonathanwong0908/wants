import type { items } from "@/db/schema";
import { itemStatusValues } from "@/db/schema";
import { CURRENCY_OPTIONS } from "@/lib/currency";
import {
  ITEM_NAME_MAX_LENGTH,
  NOTE_MAX_LENGTH,
} from "@/lib/forms/item-form-schema";
import { z } from "zod";

export const WANTS_CSV_VERSION = 1;

const VERSION_LINE_PREFIX = "# wants_export_version=";

export const WANTS_CSV_COLUMNS = [
  "name",
  "price",
  "currency",
  "delay_hours",
  "notify_at",
  "status",
  "created_at",
  "decided_at",
  "note",
] as const;

type Item = typeof items.$inferSelect;

const SUPPORTED_CURRENCY_CODES = new Set(
  CURRENCY_OPTIONS.map((option) => option.value)
);

export type ParsedItemRow = {
  name: string;
  price: number;
  currency: string;
  delayHours: number;
  notifyAt: Date;
  status: (typeof itemStatusValues)[number];
  createdAt: Date;
  decidedAt: Date | null;
  note: string | null;
};

export type CsvParseError = {
  row: number;
  message: string;
};

function escapeCsvField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatIsoDate(date: Date): string {
  return date.toISOString();
}

function parseIsoDate(value: string, field: string): Date | null {
  const trimmed = value.trim();
  if (trimmed === "") {
    return null;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${field} must be a valid ISO 8601 date`);
  }

  return parsed;
}

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if (char === "\r") {
      continue;
    }

    if (char === "\n") {
      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = "";
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

const csvRowSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "name is required")
      .max(ITEM_NAME_MAX_LENGTH, `name must be at most ${ITEM_NAME_MAX_LENGTH} characters`),
    price: z
      .string()
      .trim()
      .min(1, "price is required")
      .transform((value, ctx) => {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) {
          ctx.addIssue({ code: "custom", message: "price must be a number" });
          return z.NEVER;
        }
        if (parsed < 0) {
          ctx.addIssue({
            code: "custom",
            message: "price cannot be negative",
          });
          return z.NEVER;
        }
        return parsed;
      }),
    currency: z
      .string()
      .trim()
      .min(1, "currency is required")
      .refine((value) => SUPPORTED_CURRENCY_CODES.has(value), {
        message: "currency is not supported",
      }),
    delay_hours: z
      .string()
      .trim()
      .min(1, "delay_hours is required")
      .transform((value, ctx) => {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 1) {
          ctx.addIssue({
            code: "custom",
            message: "delay_hours must be a whole number of at least 1",
          });
          return z.NEVER;
        }
        return parsed;
      }),
    notify_at: z.string().trim().min(1, "notify_at is required"),
    status: z.enum(itemStatusValues, {
      errorMap: () => ({ message: "status must be waiting, skipped, or bought" }),
    }),
    created_at: z.string().trim().min(1, "created_at is required"),
    decided_at: z.string(),
    note: z
      .string()
      .trim()
      .max(NOTE_MAX_LENGTH, `note must be at most ${NOTE_MAX_LENGTH} characters`)
      .transform((value) => (value === "" ? null : value)),
  })
  .superRefine((row, ctx) => {
    try {
      parseIsoDate(row.notify_at, "notify_at");
    } catch (error) {
      ctx.addIssue({
        code: "custom",
        message: error instanceof Error ? error.message : "notify_at is invalid",
        path: ["notify_at"],
      });
      return;
    }

    try {
      parseIsoDate(row.created_at, "created_at");
    } catch (error) {
      ctx.addIssue({
        code: "custom",
        message:
          error instanceof Error ? error.message : "created_at is invalid",
        path: ["created_at"],
      });
      return;
    }

    let decidedAt: Date | null;
    try {
      decidedAt = parseIsoDate(row.decided_at, "decided_at");
    } catch (error) {
      ctx.addIssue({
        code: "custom",
        message:
          error instanceof Error ? error.message : "decided_at is invalid",
        path: ["decided_at"],
      });
      return;
    }

    if (row.status === "waiting" && decidedAt !== null) {
      ctx.addIssue({
        code: "custom",
        message: "decided_at must be empty when status is waiting",
        path: ["decided_at"],
      });
    }

    if (row.status !== "waiting" && decidedAt === null) {
      ctx.addIssue({
        code: "custom",
        message: "decided_at is required when status is skipped or bought",
        path: ["decided_at"],
      });
    }
  })
  .transform((row) => {
    const notifyAt = parseIsoDate(row.notify_at, "notify_at")!;
    const createdAt = parseIsoDate(row.created_at, "created_at")!;
    const decidedAt = parseIsoDate(row.decided_at, "decided_at");

    return {
      name: row.name.trim(),
      price: row.price,
      currency: row.currency.trim(),
      delayHours: row.delay_hours,
      notifyAt,
      status: row.status,
      createdAt,
      decidedAt,
      note: row.note,
    } satisfies ParsedItemRow;
  });

function rowToRecord(columns: string[], values: string[]): Record<string, string> {
  const record: Record<string, string> = {};
  for (let i = 0; i < columns.length; i += 1) {
    record[columns[i]] = values[i] ?? "";
  }
  return record;
}

export function serializeItemsToCsv(itemsToExport: Item[]): string {
  const headerLine = WANTS_CSV_COLUMNS.join(",");
  const dataLines = itemsToExport.map((item) =>
    [
      escapeCsvField(item.name),
      String(item.price),
      escapeCsvField(item.currency),
      String(item.delayHours),
      formatIsoDate(item.notifyAt),
      item.status,
      formatIsoDate(item.createdAt),
      item.decidedAt ? formatIsoDate(item.decidedAt) : "",
      escapeCsvField(item.note ?? ""),
    ].join(",")
  );

  return [`${VERSION_LINE_PREFIX}${WANTS_CSV_VERSION}`, headerLine, ...dataLines].join(
    "\n"
  );
}

export function parseItemsCsv(text: string): {
  rows: ParsedItemRow[];
  errors: CsvParseError[];
} {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
  const versionLine = lines.find((line) => line.startsWith(VERSION_LINE_PREFIX));

  if (!versionLine) {
    return {
      rows: [],
      errors: [{ row: 0, message: "Missing or invalid Wants export version header" }],
    };
  }

  const version = Number.parseInt(
    versionLine.slice(VERSION_LINE_PREFIX.length),
    10
  );

  if (version !== WANTS_CSV_VERSION) {
    return {
      rows: [],
      errors: [
        {
          row: 0,
          message: `Unsupported export version: ${versionLine}`,
        },
      ],
    };
  }

  const csvBody = lines.filter((line) => !line.startsWith("#")).join("\n");
  const parsedRows = parseCsvRows(csvBody);

  if (parsedRows.length === 0) {
    return { rows: [], errors: [] };
  }

  const [headerRow, ...dataRows] = parsedRows;
  const expectedHeader = WANTS_CSV_COLUMNS.join(",");

  if (headerRow.join(",") !== expectedHeader) {
    return {
      rows: [],
      errors: [
        {
          row: 1,
          message: `Invalid column header. Expected: ${expectedHeader}`,
        },
      ],
    };
  }

  const rows: ParsedItemRow[] = [];
  const errors: CsvParseError[] = [];

  for (let index = 0; index < dataRows.length; index += 1) {
    const values = dataRows[index];
    const rowNumber = index + 2;

    if (values.length !== WANTS_CSV_COLUMNS.length) {
      errors.push({
        row: rowNumber,
        message: `Expected ${WANTS_CSV_COLUMNS.length} columns, got ${values.length}`,
      });
      continue;
    }

    const record = rowToRecord([...WANTS_CSV_COLUMNS], values);
    const result = csvRowSchema.safeParse(record);

    if (!result.success) {
      const message = result.error.issues.map((issue) => issue.message).join("; ");
      errors.push({ row: rowNumber, message });
      continue;
    }

    rows.push(result.data);
  }

  return { rows, errors };
}
