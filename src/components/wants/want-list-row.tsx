import { Text } from "@/components/ui/text";
import type { items } from "@/db/schema";
import { formatCountdownUntil, formatCurrency } from "@/lib/money-format";
import { Pressable, View } from "react-native";

type Item = typeof items.$inferSelect;

type WantListRowProps = {
  item: Item;
  nowMs: number;
  isReady?: boolean;
};

export function WantListRow({
  item,
  nowMs,
  isReady = false,
}: WantListRowProps) {
  const subtext = isReady
    ? "Ready to decide"
    : formatCountdownUntil(item.notifyAt.getTime(), nowMs);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${formatCurrency(
        item.price,
        item.currency
      )}`}
      className="rounded-2xl border border-border bg-muted/40 px-4 py-3.5 active:bg-accent/40"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text
            className="truncate text-base font-semibold text-foreground"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text variant="muted" className="mt-1 text-sm font-medium">
            {subtext}
          </Text>
        </View>
        <Text className="shrink-0 text-base text-muted-foreground">
          {formatCurrency(item.price, item.currency)}
        </Text>
      </View>
    </Pressable>
  );
}
