import { NavigationBackIcon } from "@/components/layout/navigation-back-icon";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { router } from "expo-router";
import { ScrollView, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ScreenSection({ title, body }: { title: string; body: string }) {
  return (
    <View className="border-b border-border py-5">
      <Text className="text-base font-semibold text-foreground">{title}</Text>
      <Text variant="muted" className="mt-2 leading-6">
        {body}
      </Text>
    </View>
  );
}

export default function SettingsScreen() {
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
        <Text className="text-xl font-bold text-foreground">Settings</Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenSection
          title="Defaults"
          body="Placeholder: default delay, currency inherited by new wants, preferred notification hour (PRD)."
        />
        <ScreenSection
          title="Notifications"
          body="Placeholder: permission status + link to system settings when denied."
        />
        <ScreenSection
          title="Account"
          body="Placeholder: Upgrade to Pro, subscription status, and restore purchases (RevenueCat)."
        />
        <ScreenSection
          title="Data"
          body="Placeholder: destructive clear-all flow with confirmation."
        />
        <ScreenSection
          title="About"
          body="Placeholder: version, privacy policy + terms links."
        />
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
