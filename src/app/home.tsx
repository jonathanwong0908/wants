import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  PLACEHOLDER_DECISION_COUNT,
  PLACEHOLDER_HERO_CURRENCY,
  PLACEHOLDER_TOTAL_SAVED,
  PLACEHOLDER_UPCOMING_WANTS,
} from "@/constants/placeholder-wants";
import { useAppReady } from "@/contexts/app-ready-context";
import { formatCountdownUntil, formatCurrency } from "@/lib/money-format";
import { pushHomeAreaRoute } from "@/lib/push-home-routes";
import { THEME } from "@/lib/theme";
import { PlusSignIcon, Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { Pressable, ScrollView, useColorScheme, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { setOnboardingComplete } = useAppReady();
  const palette = THEME[useColorScheme() === "dark" ? "dark" : "light"];
  const iconTint = palette.foreground;
  const insets = useSafeAreaInsets();

  const fabBottom = Math.max(insets.bottom, 16) + 16;
  const fabRight = Math.max(insets.right, 16) + 20;
  const scrollBottomPad = fabBottom + 56 + 12;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: scrollBottomPad,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Top bar */}
          <View className="mb-6 flex-row items-center justify-between pt-2">
            <Text className="text-2xl font-bold tracking-tight text-foreground">Wants</Text>
            <Pressable
              accessibilityLabel="Settings"
              hitSlop={12}
              onPress={() => pushHomeAreaRoute("/settings")}
              className="h-10 w-10 items-center justify-center rounded-full active:bg-accent">
              <HugeiconsIcon icon={Settings01Icon} size={22} color={iconTint} strokeWidth={1.5} />
            </Pressable>
          </View>

          {/* Savings hero (PRD: total saved + label + decision count) */}
          <View className="rounded-2xl border border-border bg-card p-5">
            <Text variant="muted" className="text-xs font-medium uppercase tracking-wide">
              Saved so far
            </Text>
            <Text variant="h2" className="mt-1 border-b-0 pb-0 text-4xl tabular-nums text-card-foreground">
              {formatCurrency(PLACEHOLDER_TOTAL_SAVED, PLACEHOLDER_HERO_CURRENCY)}
            </Text>
            <Text variant="muted" className="mt-2">
              Across {PLACEHOLDER_DECISION_COUNT} decisions
            </Text>
          </View>

          {/* Upcoming */}
          <View className="mt-8 flex-row items-baseline justify-between">
            <Text className="text-lg font-semibold text-foreground">Upcoming</Text>
            <Button variant="ghost" size="sm" className="h-auto px-2 py-1" onPress={() => pushHomeAreaRoute("/all-wants")}>
              <Text className="text-sm font-medium text-primary">Show all</Text>
            </Button>
          </View>

          <View className="mt-3 gap-3">
            {PLACEHOLDER_UPCOMING_WANTS.map((want) => {
              const isExpired =
                want.status === "waiting" && Date.now() >= want.notifyAtMs;
              const countdown = formatCountdownUntil(want.notifyAtMs);

              return (
                <Pressable
                  key={want.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${want.name}, ${formatCurrency(want.price, want.currency)}`}
                  className="rounded-xl border border-border bg-muted/40 p-4 active:bg-accent/40">
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="min-w-0 flex-1">
                      <Text className="truncate text-base font-semibold text-foreground" numberOfLines={1}>
                        {want.name}
                      </Text>
                      <Text className="mt-1 text-muted-foreground">
                        {formatCurrency(want.price, want.currency)}
                      </Text>
                    </View>
                    <View className="items-end gap-2">
                      {isExpired ? (
                        <View className="rounded-full bg-secondary px-2.5 py-1">
                          <Text className="text-xs font-medium text-secondary-foreground">Ready to decide</Text>
                        </View>
                      ) : (
                        <Text variant="muted" className="text-xs font-medium">
                          {countdown}
                        </Text>
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {__DEV__ ? (
            <Button
              variant="outline"
              className="mt-8 w-full"
              onPress={() => {
                setOnboardingComplete(false);
                router.replace("/");
              }}>
              <Text>Reset onboarding (dev)</Text>
            </Button>
          ) : null}
        </ScrollView>

        {/* FAB → Add Want (modal) */}
        <View
          pointerEvents="box-none"
          className="absolute"
          style={{ bottom: fabBottom, right: fabRight }}>
          <Pressable
            accessibilityLabel="Add want"
            onPress={() => pushHomeAreaRoute("/add-want")}
            className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-md shadow-black/20 active:bg-primary/90">
            <HugeiconsIcon
              icon={PlusSignIcon}
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
