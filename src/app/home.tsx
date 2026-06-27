import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { NotificationPermissionBanner } from "@/components/wants/notification-permission-banner";
import {
  buildWaitingSectionRows,
  partitionWaitingItems,
  renderWaitingListRow,
  WAITING_LIST_ESTIMATED_ITEM_SIZE,
  waitingListKeyExtractor,
  type WaitingListRow,
} from "@/components/wants/waiting-want-list";
import { useAppReady } from "@/contexts/app-ready-context";
import { usePurchases } from "@/contexts/purchases-context";
import { useSettings } from "@/contexts/settings-context";
import { selectWaitingItems } from "@/db/queries/items";
import { useNotificationPermission } from "@/hooks/use-notification-permission";
import { useNowTick } from "@/hooks/use-now-tick";
import { useSavingsStats } from "@/hooks/use-savings-stats";
import { useThemePalette } from "@/hooks/use-theme-palette";
import { isProduction } from "@/lib/env";
import { isAddWantGatedWhenReady } from "@/lib/is-add-want-gated";
import { formatCurrency } from "@/lib/money-format";
import { DEFAULT_PLAN_ID } from "@/lib/paywall-placeholder-offerings";
import { pushHomeAreaRoute } from "@/lib/push-home-routes";
import { pushPaywallRoute } from "@/lib/push-paywall-route";
import { pushWantRoute } from "@/lib/push-want-route";
import { LegendList } from "@legendapp/list/react-native";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { router } from "expo-router";
import { ChevronRight, Plus, Settings } from "lucide-react-native";
import { useCallback, useMemo } from "react";
import { Pressable, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function HomeScreen() {
  const { setOnboardingComplete } = useAppReady();
  const palette = useThemePalette();
  const iconTint = palette.foreground;
  const insets = useSafeAreaInsets();
  const nowMs = useNowTick();
  const { granted: notificationsGranted } = useNotificationPermission();

  const { data: waitingItems } = useLiveQuery(selectWaitingItems());
  const { isPro, setDevProOverride } = usePurchases();
  const addWantGated = isAddWantGatedWhenReady(isPro, waitingItems);
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

    const rows: WaitingListRow[] = [];

    if (ready.length > 0) {
      rows.push(
        ...buildWaitingSectionRows({
          title: "Ready to decide",
          items: ready,
          isReady: true,
        })
      );
    }

    rows.push(
      ...buildWaitingSectionRows({
        title: "Upcoming",
        items: upcoming,
        emptyMessage: "Nothing waiting",
        showAllLink: true,
      })
    );

    return rows;
  }, [waitingItems, nowMs]);

  const handleShowAll = useCallback(() => {
    pushHomeAreaRoute("/all-wants");
  }, []);

  const handleItemPress = useCallback((item: { id: number }) => {
    pushWantRoute(item.id);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: WaitingListRow }) =>
      renderWaitingListRow({
        row: item,
        nowMs,
        onShowAll: handleShowAll,
        onItemPress: handleItemPress,
      }),
    [nowMs, handleShowAll, handleItemPress]
  );

  const handleOpenTotalSaved = useCallback(() => {
    pushHomeAreaRoute("/total-saved");
  }, []);

  const handleFabPress = useCallback(() => {
    if (addWantGated === true) {
      pushPaywallRoute();
      return;
    }
    pushHomeAreaRoute("/add-want");
  }, [addWantGated]);

  const ListHeaderComponent = useMemo(() => {
    const savingsLabel = hasOtherCurrencySkipped
      ? `Saved so far in ${currencyCode}`
      : "Saved so far";
    const formattedTotal = formatCurrency(totalSaved, currencyCode);
    const decisionsLabel = `across ${skippedCount} ${
      skippedCount === 1 ? "decision" : "decisions"
    }`;

    return (
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

        <NotificationPermissionBanner
          granted={notificationsGranted}
          waitingItems={waitingItems ?? []}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Total saved, ${formattedTotal}, ${decisionsLabel}`}
          onPress={handleOpenTotalSaved}
          className="-mx-1 rounded-xl px-1"
          style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
        >
          <Text
            variant="muted"
            className="text-xs font-bold uppercase tracking-wide"
          >
            {savingsLabel}
          </Text>
          <View className="mt-1 flex-row items-center gap-1">
            <Text
              variant="h2"
              className="border-b-0 pb-0 text-4xl tabular-nums text-card-foreground"
            >
              {formattedTotal}
            </Text>
            <ChevronRight
              size={28}
              color={palette.mutedForeground}
              strokeWidth={1.5}
            />
          </View>
          <Text variant="muted" className="mt-1 text-sm">
            {decisionsLabel}
          </Text>
        </Pressable>
      </View>
    );
  }, [
    iconTint,
    palette.mutedForeground,
    currencyCode,
    totalSaved,
    skippedCount,
    hasOtherCurrencySkipped,
    notificationsGranted,
    waitingItems,
    handleOpenTotalSaved,
  ]);

  const ListFooterComponent = useMemo(
    () =>
      !isProduction ? (
        <View>
          <Button
            variant="outline"
            className="mt-8 w-full"
            onPress={() => {
              setDevProOverride(!isPro, DEFAULT_PLAN_ID);
            }}
          >
            <Text>Toggle Pro (dev) — {isPro ? "on" : "off"}</Text>
          </Button>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onPress={() => {
              setOnboardingComplete(false);
              router.replace("/");
            }}
          >
            <Text>Reset onboarding (dev)</Text>
          </Button>
        </View>
      ) : null,
    [isPro, setDevProOverride, setOnboardingComplete]
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-1">
        <LegendList
          className="flex-1 px-4"
          data={listData}
          extraData={{ totalSaved, skippedCount, hasOtherCurrencySkipped }}
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
            accessibilityLabel={
              addWantGated === true ? "Upgrade to add more wants" : "Add want"
            }
            onPress={handleFabPress}
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
