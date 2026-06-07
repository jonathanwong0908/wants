import { ScreenBackButton } from "@/components/layout/screen-back-button";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { WantDecisionActions } from "@/components/wants/want-decision-actions";
import { WantDetailContent } from "@/components/wants/want-detail-content";
import { selectItemById } from "@/db/queries/items";
import { useNowTick } from "@/hooks/use-now-tick";
import { parseItemId } from "@/lib/parse-item-id";
import { pushEditWantRoute } from "@/lib/push-edit-want-route";
import { THEME } from "@/lib/theme";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";
import { ScrollView, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WantDetailScreen() {
  const router = useRouter();
  const palette = THEME[useColorScheme() === "dark" ? "dark" : "light"];
  const { id } = useLocalSearchParams<{ id: string }>();
  const nowMs = useNowTick();
  const itemId = parseItemId(id);

  const { data } = useLiveQuery(
    itemId != null ? selectItemById(itemId) : selectItemById(-1)
  );
  const item = itemId != null ? data?.[0] : undefined;
  const isWaiting = item?.status === "waiting";
  const isReady = isWaiting && item != null && item.notifyAt.getTime() <= nowMs;

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
          <WantDecisionActions isReady={isReady} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
