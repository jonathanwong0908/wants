import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";

import { clearAllItems } from "@/db/mutations/clear-all-data";
import { insertImportedItems } from "@/db/mutations/items";
import {
  parseItemsCsv,
  type CsvParseError,
  type ParsedItemRow,
} from "@/lib/csv/items-csv";
import { reconcileWaitingWantNotifications } from "@/lib/notifications";

export type ImportMode = "merge" | "replace";

export type PickAndParseResult =
  | { canceled: true }
  | {
      canceled: false;
      rows: ParsedItemRow[];
      errors: CsvParseError[];
    };

export type ImportResult = {
  importedCount: number;
};

export async function pickAndParseItemsCsv(): Promise<PickAndParseResult> {
  const result = await DocumentPicker.getDocumentAsync({
    type: [
      "text/csv",
      "text/comma-separated-values",
      "application/csv",
      "text/plain",
    ],
    copyToCacheDirectory: true,
  });

  if (result.canceled || result.assets.length === 0) {
    return { canceled: true };
  }

  const file = new File(result.assets[0].uri);
  const text = file.textSync();
  const { rows, errors } = parseItemsCsv(text);

  return { canceled: false, rows, errors };
}

export async function importParsedItems(
  rows: ParsedItemRow[],
  mode: ImportMode
): Promise<ImportResult> {
  if (rows.length === 0) {
    return { importedCount: 0 };
  }

  if (mode === "replace") {
    await clearAllItems();
  }

  const inserted = await insertImportedItems(rows);
  await reconcileWaitingWantNotifications();

  return { importedCount: inserted.length };
}
