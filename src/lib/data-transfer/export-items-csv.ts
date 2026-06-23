import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { selectAllItems } from "@/db/queries/items";
import { serializeItemsToCsv } from "@/lib/csv/items-csv";

function formatExportFilename(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `wants-export-${year}-${month}-${day}.csv`;
}

export class DataTransferError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataTransferError";
  }
}

export async function exportItemsToCsvAndShare(): Promise<{ itemCount: number }> {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new DataTransferError(
      "Sharing is not available on this device. Export is supported on iOS and Android."
    );
  }

  const allItems = await selectAllItems();

  if (allItems.length === 0) {
    throw new DataTransferError("Nothing to export. Add some wants first.");
  }

  const csv = serializeItemsToCsv(allItems);
  const filename = formatExportFilename(new Date());
  const file = new File(Paths.cache, filename);

  if (file.exists) {
    file.delete();
  }

  file.create();
  file.write(csv);

  await Sharing.shareAsync(file.uri, {
    mimeType: "text/csv",
    UTI: "public.comma-separated-values-text",
    dialogTitle: "Export Wants data",
  });

  return { itemCount: allItems.length };
}
