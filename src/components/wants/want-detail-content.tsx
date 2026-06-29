import { FieldContainer } from "@/components/common/field";
import { Text } from "@/components/ui/text";
import type { items } from "@/db/schema";
import { formatAddedDate, formatDecidedDate } from "@/lib/date-format";
import { formatCountdownUntil, formatCurrency } from "@/lib/money-format";
import { formatDelayHours } from "@/lib/want-format";
import { View } from "react-native";

type Item = typeof items.$inferSelect;

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View className="px-4 py-3">
      <Text variant="meta">{label}</Text>
      <Text className="mt-1 text-base text-foreground">{value}</Text>
    </View>
  );
}

type WantDetailContentProps = {
  item: Item;
  nowMs: number;
};

export function WantDetailContent({ item, nowMs }: WantDetailContentProps) {
  const isWaiting = item.status === "waiting";
  const isReady = isWaiting && item.notifyAt.getTime() <= nowMs;
  const statusLabel = isWaiting
    ? isReady
      ? "Ready to decide"
      : formatCountdownUntil(item.notifyAt.getTime(), nowMs)
    : item.status === "skipped"
    ? "Saved"
    : "Bought";

  return (
    <View className="gap-4">
      <View>
        <Text variant="muted" className="text-2xl font-bold">
          {item.name}
        </Text>
        <Text className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
          {formatCurrency(item.price, item.currency)}
        </Text>
        <Text variant="muted" className="mt-4 text-base font-medium">
          {statusLabel}
        </Text>
      </View>

      <FieldContainer>
        <DetailRow
          label="Wait period"
          value={formatDelayHours(item.delayHours)}
        />
        <View className="h-px bg-border" />
        <DetailRow label="Added on" value={formatAddedDate(item.createdAt)} />
        {isWaiting ? (
          <>
            <View className="h-px bg-border" />
            <DetailRow
              label="Decides on"
              value={formatAddedDate(item.notifyAt)}
            />
          </>
        ) : null}
        {!isWaiting && item.decidedAt ? (
          <>
            <View className="h-px bg-border" />
            <DetailRow
              label="Decided"
              value={formatDecidedDate(item.decidedAt)}
            />
          </>
        ) : null}
      </FieldContainer>

      {item.note ? (
        <FieldContainer>
          <View className="px-4 py-3">
            <Text variant="meta">Note</Text>
            <Text className="mt-1 text-base text-foreground">{item.note}</Text>
          </View>
        </FieldContainer>
      ) : null}
    </View>
  );
}
