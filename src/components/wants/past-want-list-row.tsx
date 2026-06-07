import { Text } from "@/components/ui/text";
import type { items } from "@/db/schema";
import { formatDecidedDate } from "@/lib/date-format";
import { formatCurrency } from "@/lib/money-format";
import { View } from "react-native";

type Item = typeof items.$inferSelect;

type PastWantListRowProps = {
  item: Item;
};

export function PastWantListRow({ item }: PastWantListRowProps) {
  const statusLabel = item.status === "skipped" ? "Saved" : "Bought";
  const decidedLabel = item.decidedAt
    ? formatDecidedDate(item.decidedAt)
    : null;

  return (
    <View className="rounded-2xl border border-border bg-muted/40 px-4 py-3.5">
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text
            className="truncate text-base font-semibold text-foreground"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          {decidedLabel ? (
            <Text variant="muted" className="mt-1 text-sm font-medium">
              {decidedLabel}
            </Text>
          ) : null}
        </View>
        <View className="shrink-0 items-end gap-1">
          <Text variant="muted" className="text-xs font-medium uppercase">
            {statusLabel}
          </Text>
          <Text className="text-base text-muted-foreground">
            {formatCurrency(item.price, item.currency)}
          </Text>
        </View>
      </View>
    </View>
  );
}
