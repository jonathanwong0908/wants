import { FieldContainer, FieldContainerItem } from "@/components/common/field";
import { SettingsScreenShell } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";
import { clearAllItems } from "@/db/mutations/clear-all-data";
import { countAllItems } from "@/db/queries/items";
import type { ParsedItemRow } from "@/lib/csv/items-csv";
import {
  DataTransferError,
  exportItemsToCsvAndShare,
} from "@/lib/data-transfer/export-items-csv";
import {
  importParsedItems,
  pickAndParseItemsCsv,
} from "@/lib/data-transfer/import-items-csv";
import { cn } from "@/lib/utils";
import { Separator } from "@rn-primitives/dropdown-menu";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Platform, View } from "react-native";

const isNative = Platform.OS !== "web";

function formatImportErrors(errorCount: number): string {
  if (errorCount === 1) {
    return "1 row could not be imported. Check the file and try again.";
  }
  return `${errorCount} rows could not be imported. Check the file and try again.`;
}

export default function SettingsDataScreen() {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const { data: countRows } = useLiveQuery(countAllItems());
  const itemCount = countRows?.[0]?.count ?? 0;

  const isBusy = isClearing || isExporting || isImporting;
  const canExport = isNative && itemCount > 0 && !isBusy;
  const canImport = isNative && !isBusy;
  const canClear = !isBusy;

  async function performExport() {
    setIsExporting(true);
    try {
      await exportItemsToCsvAndShare();
    } catch (error) {
      const message =
        error instanceof DataTransferError
          ? error.message
          : "Something went wrong. Please try again.";
      Alert.alert("Could not export data", message);
      console.error("exportItemsToCsvAndShare failed:", error);
    } finally {
      setIsExporting(false);
    }
  }

  async function performImport(rows: ParsedItemRow[], mode: "merge" | "replace") {
    setIsImporting(true);
    try {
      const { importedCount } = await importParsedItems(rows, mode);
      Alert.alert(
        "Import complete",
        importedCount === 1
          ? "Imported 1 item."
          : `Imported ${importedCount} items.`
      );
    } catch (error) {
      Alert.alert(
        "Could not import data",
        "Something went wrong. Please try again."
      );
      console.error("importParsedItems failed:", error);
    } finally {
      setIsImporting(false);
    }
  }

  function confirmImportMode(rows: ParsedItemRow[]) {
    Alert.alert(
      "Import data?",
      "You already have logged wants on this device. Replace everything with the imported file, or merge the imported rows with what you have?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Merge with existing",
          onPress: () => void performImport(rows, "merge"),
        },
        {
          text: "Replace all and import",
          style: "destructive",
          onPress: () => void performImport(rows, "replace"),
        },
      ]
    );
  }

  async function handleImportPress() {
    setIsImporting(true);
    try {
      const result = await pickAndParseItemsCsv();

      if (result.canceled) {
        return;
      }

      if (result.errors.length > 0) {
        Alert.alert("Could not import file", formatImportErrors(result.errors.length));
        return;
      }

      if (result.rows.length === 0) {
        Alert.alert("Nothing to import", "The selected file contains no items.");
        return;
      }

      if (itemCount > 0) {
        confirmImportMode(result.rows);
        return;
      }

      await performImport(result.rows, "merge");
    } catch (error) {
      Alert.alert(
        "Could not import data",
        "Something went wrong. Please try again."
      );
      console.error("pickAndParseItemsCsv failed:", error);
    } finally {
      setIsImporting(false);
    }
  }

  async function performClear() {
    setIsClearing(true);
    try {
      await clearAllItems();
      router.dismissAll();
    } catch (error) {
      Alert.alert(
        "Could not clear data",
        "Something went wrong. Please try again."
      );
      console.error("clearAllItems failed:", error);
    } finally {
      setIsClearing(false);
    }
  }

  function handleClearPress() {
    Alert.alert(
      "Clear all data?",
      "All logged wants and past decisions will be permanently deleted. This can't be undone. Your currency and default delay settings will be kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear all data",
          style: "destructive",
          onPress: () => void performClear(),
        },
      ]
    );
  }

  return (
    <SettingsScreenShell title="Data">
      <View className="mt-4">
        <FieldContainer>
          {isNative ? (
            <>
              <FieldContainerItem
                onPress={canExport ? () => void performExport() : undefined}
              >
                <Text
                  className={cn(
                    "text-base text-foreground",
                    !canExport && "text-muted-foreground"
                  )}
                >
                  Export to CSV
                </Text>
              </FieldContainerItem>
              <Separator />
              <FieldContainerItem
                onPress={canImport ? () => void handleImportPress() : undefined}
              >
                <Text
                  className={cn(
                    "text-base text-foreground",
                    !canImport && "text-muted-foreground"
                  )}
                >
                  Import from CSV
                </Text>
              </FieldContainerItem>
              <Separator />
            </>
          ) : null}
          <FieldContainerItem
            onPress={canClear ? handleClearPress : undefined}
            showChevron={false}
          >
            <Text
              className={cn(
                "text-base text-destructive",
                !canClear && "opacity-50"
              )}
            >
              Clear all data
            </Text>
          </FieldContainerItem>
        </FieldContainer>
      </View>
    </SettingsScreenShell>
  );
}
