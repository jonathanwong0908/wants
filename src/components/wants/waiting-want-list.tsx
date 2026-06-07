import { Text } from "@/components/ui/text";
import { WantListRow } from "@/components/wants/want-list-row";
import type { items } from "@/db/schema";
import { Pressable, View } from "react-native";

type Item = typeof items.$inferSelect;

export type WaitingListRow =
  | {
      type: "section-header";
      id: string;
      title: string;
      showAllLink?: boolean;
    }
  | { type: "item"; id: string; item: Item; isReady: boolean }
  | { type: "empty"; id: string; message: string };

export function partitionWaitingItems(
  waitingItems: Item[],
  nowMs: number
): { upcoming: Item[]; ready: Item[] } {
  const upcoming: Item[] = [];
  const ready: Item[] = [];

  for (const item of waitingItems) {
    if (item.notifyAt.getTime() > nowMs) {
      upcoming.push(item);
    } else {
      ready.push(item);
    }
  }

  return { upcoming, ready };
}

export function buildWaitingSectionRows({
  title,
  items,
  emptyMessage,
  showAllLink = false,
  isReady = false,
}: {
  title: string;
  items: Item[];
  emptyMessage?: string;
  showAllLink?: boolean;
  isReady?: boolean;
}): WaitingListRow[] {
  const rows: WaitingListRow[] = [
    {
      type: "section-header",
      id: `header-${title}`,
      title,
      showAllLink,
    },
  ];

  if (items.length === 0 && emptyMessage) {
    rows.push({ type: "empty", id: `empty-${title}`, message: emptyMessage });
  } else {
    for (const item of items) {
      rows.push({ type: "item", id: `item-${item.id}`, item, isReady });
    }
  }

  return rows;
}

type RenderWaitingListRowProps = {
  row: WaitingListRow;
  nowMs: number;
  onShowAll?: () => void;
  onItemPress?: (item: Item) => void;
};

export function renderWaitingListRow({
  row,
  nowMs,
  onShowAll,
  onItemPress,
}: RenderWaitingListRowProps) {
  switch (row.type) {
    case "section-header":
      return (
        <View className="mt-8 flex-row items-baseline justify-between">
          <Text className="text-lg font-semibold text-foreground">
            {row.title}
          </Text>
          {row.showAllLink && onShowAll ? (
            <Pressable onPress={onShowAll}>
              <Text className="text-sm font-medium text-primary">Show all</Text>
            </Pressable>
          ) : null}
        </View>
      );
    case "empty":
      return (
        <View className="h-32 items-center justify-center px-8">
          <Text variant="muted" className="text-sm text-center">
            {row.message}
          </Text>
        </View>
      );
    case "item":
      return (
        <View className="mt-2">
          <WantListRow
            item={row.item}
            nowMs={nowMs}
            isReady={row.isReady}
            onPress={onItemPress ? () => onItemPress(row.item) : undefined}
          />
        </View>
      );
  }
}

export const WAITING_LIST_ESTIMATED_ITEM_SIZE = 72;

export function waitingListKeyExtractor(row: WaitingListRow) {
  return row.id;
}
