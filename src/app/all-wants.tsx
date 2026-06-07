import { ScreenBackButton } from "@/components/layout/screen-back-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { PastWantListRow } from "@/components/wants/past-want-list-row";
import { WAITING_LIST_ESTIMATED_ITEM_SIZE } from "@/components/wants/waiting-want-list";
import { WantListRow } from "@/components/wants/want-list-row";
import { selectPastItems, selectWaitingItems } from "@/db/queries/items";
import type { items } from "@/db/schema";
import { useNowTick } from "@/hooks/use-now-tick";
import { pushWantRoute } from "@/lib/push-want-route";
import { LegendList } from "@legendapp/list/react-native";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Item = typeof items.$inferSelect;

const PAST_LIST_ESTIMATED_ITEM_SIZE = 84;

function ListEmpty({ message }: { message: string }) {
  return (
    <View className="h-40 justify-center items-center px-8">
      <Text variant="muted" className="mt-4 text-sm text-center">
        {message}
      </Text>
    </View>
  );
}

export default function AllWantsScreen() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const nowMs = useNowTick();

  const { data: waitingItems } = useLiveQuery(selectWaitingItems());
  const { data: pastItems } = useLiveQuery(selectPastItems());

  const upcomingData = waitingItems ?? [];
  const pastData = pastItems ?? [];

  const handleItemPress = useCallback((item: Item) => {
    pushWantRoute(item.id);
  }, []);

  const renderUpcomingItem = useCallback(
    ({ item }: { item: Item }) => (
      <View className="mb-2">
        <WantListRow
          item={item}
          nowMs={nowMs}
          isReady={item.notifyAt.getTime() <= nowMs}
          onPress={() => handleItemPress(item)}
        />
      </View>
    ),
    [nowMs, handleItemPress]
  );

  const renderPastItem = useCallback(
    ({ item }: { item: Item }) => (
      <View className="mb-2">
        <PastWantListRow item={item} onPress={() => handleItemPress(item)} />
      </View>
    ),
    [handleItemPress]
  );

  const upcomingKeyExtractor = useCallback((item: Item) => String(item.id), []);

  const pastKeyExtractor = useCallback((item: Item) => String(item.id), []);

  const UpcomingEmpty = useMemo(
    () => <ListEmpty message="Nothing waiting." />,
    []
  );

  const PastEmpty = useMemo(
    () => <ListEmpty message="No decisions yet." />,
    []
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-row items-center gap-2 px-4 pb-4 pt-2">
        <ScreenBackButton variant="stack" className="mr-1 rounded-full" />
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
