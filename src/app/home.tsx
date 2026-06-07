import {
  buildWaitingSectionRows,
  partitionWaitingItems,
  renderWaitingListRow,
  WAITING_LIST_ESTIMATED_ITEM_SIZE,
  waitingListKeyExtractor,
  type WaitingListRow,
} from "@/components/wants/waiting-want-list";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAppReady } from "@/contexts/app-ready-context";
import { useSettings } from "@/contexts/settings-context";
import { selectWaitingItems } from "@/db/queries/items";
import { useNowTick } from "@/hooks/use-now-tick";
import { useSavingsStats } from "@/hooks/use-savings-stats";
import { formatCurrency } from "@/lib/money-format";
import { pushHomeAreaRoute } from "@/lib/push-home-routes";
import { THEME } from "@/lib/theme";
import { LegendList } from "@legendapp/list/react-native";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { router } from "expo-router";
import { Plus, Settings } from "lucide-react-native";
import { useCallback, useMemo } from "react";
import { Pressable, useColorScheme, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function HomeScreen() {
  const { setOnboardingComplete } = useAppReady();
  const palette = THEME[useColorScheme() === "dark" ? "dark" : "light"];
  const iconTint = palette.foreground;
  const insets = useSafeAreaInsets();
  const nowMs = useNowTick();

  const { data: waitingItems } = useLiveQuery(selectWaitingItems());
  const { currencyCode } = useSettings();
  const { totalSaved, skippedCount, hasOtherCurrencySkipped } =
    useSavingsStats(currencyCode);

  const fabBottom = Math.max(insets.bottom, 16) + 12;
  const scrollBottomPad = fabBottom + 56 + 12;

  const listData = useMemo(() => {
    const { upcoming, ready } = partitionWaitingItems(
      waitingItems ?? [],
      nowMs
    );

    const rows: WaitingListRow[] = [
      ...buildWaitingSectionRows({
        title: "Upcoming",
        items: upcoming,
        emptyMessage: "Nothing waiting. Add something you're eyeing.",
        showAllLink: true,
      }),
    ];

    if (ready.length > 0) {
      rows.push(
        ...buildWaitingSectionRows({
          title: "Ready to decide",
          items: ready,
          isReady: true,
        })
      );
    }

    return rows;
  }, [waitingItems, nowMs]);

  const handleShowAll = useCallback(() => {
    pushHomeAreaRoute("/all-wants");
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: WaitingListRow }) =>
      renderWaitingListRow({ row: item, nowMs, onShowAll: handleShowAll }),
    [nowMs, handleShowAll]
  );

  const ListHeaderComponent = useMemo(
    () => (
      <View>
        <View className="mb-6 flex-row items-center justify-end pt-2">
          <Button
            variant="outline"
            size="icon"
            accessibilityLabel="Settings"
            onPress={() => pushHomeAreaRoute("/settings")}
          >
            <Settings size={22} color={iconTint} strokeWidth={1.5} />
          </Button>
        </View>

        <Text
          variant="muted"
          className="text-xs font-bold uppercase tracking-wide"
        >
          Saved so far
        </Text>
        <Text
          variant="h2"
          className="mt-1 border-b-0 pb-0 text-4xl tabular-nums text-card-foreground"
        >
          {formatCurrency(totalSaved, currencyCode)}
        </Text>
        <Text variant="muted" className="mt-1 text-sm">
          across {skippedCount}{" "}
          {skippedCount === 1 ? "decision" : "decisions"}
        </Text>
        {hasOtherCurrencySkipped ? (
          <Text variant="muted" className="mt-1 text-xs">
            Some savings in other currencies aren&apos;t included.
          </Text>
        ) : null}
      </View>
    ),
    [
      iconTint,
      currencyCode,
      totalSaved,
      skippedCount,
      hasOtherCurrencySkipped,
    ]
  );

  const ListFooterComponent = useMemo(
    () =>
      __DEV__ ? (
        <View>
          <Button
            variant="outline"
            className="mt-8 w-full"
            onPress={() => {
              setOnboardingComplete(false);
              router.replace("/");
            }}
          >
            <Text>Reset onboarding (dev)</Text>
          </Button>
        </View>
      ) : null,
    [setOnboardingComplete]
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-1">
        <LegendList
          className="flex-1 px-4"
          data={listData}
          renderItem={renderItem}
          keyExtractor={waitingListKeyExtractor}
          estimatedItemSize={WAITING_LIST_ESTIMATED_ITEM_SIZE}
          recycleItems
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: scrollBottomPad,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />

        <View
          pointerEvents="box-none"
          className="absolute"
          style={{ bottom: fabBottom, right: 16 }}
        >
          <Pressable
            accessibilityLabel="Add want"
            onPress={() => pushHomeAreaRoute("/add-want")}
            className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-md shadow-black/20 active:bg-primary/90"
          >
            <Plus
              size={28}
              color={palette.primaryForeground}
              strokeWidth={1.75}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
