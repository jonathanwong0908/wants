import { NavigationBackIcon } from "@/components/layout/navigation-back-icon";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { PastWantListRow } from "@/components/wants/past-want-list-row";
import { WAITING_LIST_ESTIMATED_ITEM_SIZE } from "@/components/wants/waiting-want-list";
import { WantListRow } from "@/components/wants/want-list-row";
import { selectPastItems, selectWaitingItems } from "@/db/queries/items";
import type { items } from "@/db/schema";
import { useNowTick } from "@/hooks/use-now-tick";
import { useSavingsStats } from "@/hooks/use-savings-stats";
import { getCurrencyCode } from "@/lib/currency";
import { formatCurrency } from "@/lib/money-format";
import { THEME } from "@/lib/theme";
import { LegendList } from "@legendapp/list/react-native";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Item = typeof items.$inferSelect;

const PAST_LIST_ESTIMATED_ITEM_SIZE = 84;

function ListEmpty({ message }: { message: string }) {
  return (
    <View className="h-40 justify-center items-center">
      <Text variant="muted" className="mt-4 text-sm">
        {message}
      </Text>
    </View>
  );
}

function PastSummary() {
  const currencyCode = getCurrencyCode();
  const { totalSaved, skippedCount, boughtCount } =
    useSavingsStats(currencyCode);

  return (
    <Text variant="muted" className="mb-4 text-sm">
      {skippedCount} skipped · {boughtCount} bought ·{" "}
      {formatCurrency(totalSaved, currencyCode)} saved
    </Text>
  );
}

export default function AllWantsScreen() {
  const palette = THEME[useColorScheme() === "dark" ? "dark" : "light"];
  const [activeTab, setActiveTab] = useState("upcoming");
  const nowMs = useNowTick();

  const { data: waitingItems } = useLiveQuery(selectWaitingItems());
  const { data: pastItems } = useLiveQuery(selectPastItems());

  const upcomingData = waitingItems ?? [];
  const pastData = pastItems ?? [];

  const renderUpcomingItem = useCallback(
    ({ item }: { item: Item }) => (
      <View className="mb-2">
        <WantListRow
          item={item}
          nowMs={nowMs}
          isReady={item.notifyAt.getTime() <= nowMs}
        />
      </View>
    ),
    [nowMs]
  );

  const renderPastItem = useCallback(
    ({ item }: { item: Item }) => (
      <View className="mb-2">
        <PastWantListRow item={item} />
      </View>
    ),
    []
  );

  const upcomingKeyExtractor = useCallback((item: Item) => String(item.id), []);

  const pastKeyExtractor = useCallback((item: Item) => String(item.id), []);

  const UpcomingEmpty = useMemo(
    () => <ListEmpty message="Nothing waiting. Add something you're eyeing." />,
    []
  );

  const PastEmpty = useMemo(
    () => <ListEmpty message="No decisions yet." />,
    []
  );

  const PastListHeader = useMemo(
    () => (pastData.length > 0 ? <PastSummary /> : null),
    [pastData.length]
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-row items-center gap-2 px-4 pb-4 pt-2">
        <Button
          variant="outline"
          size="icon"
          className="mr-1 rounded-full"
          onPress={() => router.back()}
          accessibilityLabel="Back"
        >
          <NavigationBackIcon color={palette.foreground} />
        </Button>
        <Text className="text-xl font-bold text-foreground">All Wants</Text>
      </View>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 px-4"
      >
        <TabsList className="mb-2 w-full">
          <TabsTrigger value="upcoming" className="w-1/2">
            <Text>Upcoming</Text>
          </TabsTrigger>
          <TabsTrigger value="past" className="w-1/2">
            <Text>Past</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="flex-1">
          <LegendList
            className="flex-1"
            data={upcomingData}
            renderItem={renderUpcomingItem}
            keyExtractor={upcomingKeyExtractor}
            estimatedItemSize={WAITING_LIST_ESTIMATED_ITEM_SIZE}
            recycleItems
            ListEmptyComponent={UpcomingEmpty}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </TabsContent>

        <TabsContent value="past" className="flex-1">
          <LegendList
            className="flex-1"
            data={pastData}
            renderItem={renderPastItem}
            keyExtractor={pastKeyExtractor}
            estimatedItemSize={PAST_LIST_ESTIMATED_ITEM_SIZE}
            recycleItems
            ListHeaderComponent={PastListHeader}
            ListEmptyComponent={PastEmpty}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </TabsContent>
      </Tabs>
    </SafeAreaView>
  );
}
