import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function FieldPlaceholder({ label }: { label: string }) {
  return (
    <View className="mb-6">
      <Text variant="muted" className="mb-2 text-xs font-semibold uppercase tracking-wide">
        {label}
      </Text>
      <View className="min-h-12 justify-center rounded-md border border-dashed border-border bg-muted/30 px-3 py-2">
        <Text variant="muted" className="text-sm italic">
          Placeholder — form coming next.
        </Text>
      </View>
    </View>
  );
}

export default function AddWantModalScreen() {
  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
        <Button variant="ghost" size="sm" className="-ml-2 h-auto px-2 py-1" onPress={() => router.back()}>
          <Text className="text-base font-medium text-primary">Cancel</Text>
        </Button>
        <Text className="text-lg font-semibold text-foreground">Add Want</Text>
        <View className="w-16" />
      </View>

      <ScrollView className="flex-1 px-6 pt-4" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text variant="muted" className="mb-4">
          Log what you want, set a wait, and we will remind you when it is time to decide.
        </Text>
        <FieldPlaceholder label="Name" />
        <FieldPlaceholder label="Price" />
        <FieldPlaceholder label="Delay" />
        <FieldPlaceholder label="Note (optional)" />
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
