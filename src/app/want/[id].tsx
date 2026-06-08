import { ScreenBackButton } from "@/components/layout/screen-back-button";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { WantDecisionActions } from "@/components/wants/want-decision-actions";
import { WantDetailContent } from "@/components/wants/want-detail-content";
import { buyItem, skipItem } from "@/db/mutations/items";
import { selectItemById } from "@/db/queries/items";
import { useNowTick } from "@/hooks/use-now-tick";
import { useThemePalette } from "@/hooks/use-theme-palette";
import { formatCurrency } from "@/lib/money-format";
import { parseItemId } from "@/lib/parse-item-id";
import { pushEditWantRoute } from "@/lib/push-edit-want-route";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WantDetailScreen() {
  const router = useRouter();
  const palette = useThemePalette();
  const { id } = useLocalSearchParams<{ id: string }>();
  const nowMs = useNowTick();
  const itemId = parseItemId(id);

  const { data } = useLiveQuery(
    itemId != null ? selectItemById(itemId) : selectItemById(-1)
  );
  const item = itemId != null ? data?.[0] : undefined;
  const isWaiting = item?.status === "waiting";
  const [isSkipping, setIsSkipping] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  function handleBuyPress() {
    if (!item) return;
    Alert.alert(
      "Buy this?",
      `Log ${item.name} (${formatCurrency(item.price, item.currency)}) as a purchase.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Buy it", onPress: () => void performBuy() },
      ]
    );
  }

  async function performBuy() {
    if (!item) return;
    setIsBuying(true);
    try {
      await buyItem(item.id, { notifId: item.notifId });
      router.back();
    } catch (error) {
      Alert.alert(
        "Could not save decision",
        "Something went wrong. Please try again."
      );
      console.error("buyItem failed:", error);
    } finally {
      setIsBuying(false);
    }
  }

  async function handleMovedOn() {
    if (!item) return;
    setIsSkipping(true);
    try {
      await skipItem(item.id, { notifId: item.notifId });
      router.back();
    } catch (error) {
      Alert.alert(
        "Could not save decision",
        "Something went wrong. Please try again."
      );
      console.error("skipItem failed:", error);
    } finally {
      setIsSkipping(false);
    }
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-5 py-5">
        <ScreenBackButton
          variant="modal"
          className="pt-1"
          accessibilityLabel="Close want details"
        />
        {item ? (
          <Button
            variant="outline"
            size="icon"
            accessibilityLabel="Edit want"
            onPress={() => pushEditWantRoute(item.id)}
          >
            <Pencil size={22} color={palette.foreground} strokeWidth={1.5} />
          </Button>
        ) : (
          <View className="h-10 w-10" />
        )}
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {item ? (
          <WantDetailContent item={item} nowMs={nowMs} />
        ) : (
          <View className="flex-1 items-center justify-center py-16">
            <Text className="text-lg font-semibold text-foreground">
              Want not found
            </Text>
            <Text variant="muted" className="mt-2 text-center text-sm">
              This want may have been removed or the link is invalid.
            </Text>
            <Button
              variant="outline"
              className="mt-6 rounded-full"
              onPress={() => router.back()}
            >
              <Text>Go back</Text>
            </Button>
          </View>
        )}
      </ScrollView>

      {isWaiting ? (
        <View className="border-t border-border px-5 pt-4">
          <WantDecisionActions
            onBuyPress={handleBuyPress}
            onMovedOn={() => void handleMovedOn()}
            isSkipping={isSkipping}
            isBuying={isBuying}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
