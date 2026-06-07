import { WantDetailContent } from "@/components/wants/want-detail-content";
import { ScreenBackButton } from "@/components/layout/screen-back-button";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { selectItemById } from "@/db/queries/items";
import { useNowTick } from "@/hooks/use-now-tick";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function parseItemId(raw: string | string[] | undefined): number | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export default function WantDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const nowMs = useNowTick();
  const itemId = parseItemId(id);

  const { data } = useLiveQuery(
    itemId != null ? selectItemById(itemId) : selectItemById(-1)
  );
  const item = itemId != null ? data?.[0] : undefined;

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <View className="flex-row items-center px-5 py-5">
        <ScreenBackButton
          variant="modal"
          className="pt-1"
          accessibilityLabel="Close want details"
        />
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
    </SafeAreaView>
  );
}
