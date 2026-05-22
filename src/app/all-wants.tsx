import { NavigationBackIcon } from "@/components/layout/navigation-back-icon";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  PLACEHOLDER_PAST_WANTS,
  PLACEHOLDER_UPCOMING_WANTS,
  type PlaceholderWantRow,
} from "@/constants/placeholder-wants";
import { formatCurrency } from "@/lib/money-format";
import { THEME } from "@/lib/theme";
import { router } from "expo-router";
import { ScrollView, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function RowHint({ row }: { row: PlaceholderWantRow }) {
  const statusLabel =
    row.status === "waiting"
      ? "Waiting"
      : row.status === "skipped"
      ? "Saved"
      : "Bought";

  return (
    <View className="rounded-lg border border-border bg-muted/40 px-4 py-3">
      <View className="flex-row items-center justify-between gap-3">
        <Text
          className="flex-1 text-base font-medium text-foreground"
          numberOfLines={1}
        >
          {row.name}
        </Text>
        <Text variant="muted" className="text-xs uppercase">
          {statusLabel}
        </Text>
      </View>
      <Text variant="muted" className="mt-1 text-sm tabular-nums">
        {formatCurrency(row.price, row.currency)}
      </Text>
    </View>
  );
}

export default function AllWantsScreen() {
  const palette = THEME[useColorScheme() === "dark" ? "dark" : "light"];

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-row items-center px-6 pb-4 pt-2">
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 rounded-full active:bg-accent"
          onPress={() => router.back()}
          accessibilityLabel="Back"
        >
          <NavigationBackIcon color={palette.foreground} />
        </Button>
        <Text className="text-xl font-bold text-foreground">All Wants</Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text
          variant="muted"
          className="mb-2 text-xs font-semibold uppercase tracking-wide"
        >
          Upcoming
        </Text>
        <View className="gap-2">
          {PLACEHOLDER_UPCOMING_WANTS.map((row) => (
            <RowHint key={row.id} row={row} />
          ))}
        </View>

        <Text
          variant="muted"
          className="mb-2 mt-8 text-xs font-semibold uppercase tracking-wide"
        >
          Past
        </Text>
        <View className="gap-2">
          {PLACEHOLDER_PAST_WANTS.map((row) => (
            <RowHint key={row.id} row={row} />
          ))}
        </View>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
