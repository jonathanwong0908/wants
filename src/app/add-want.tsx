import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ChevronDown, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function FieldPlaceholder({ label }: { label: string }) {
  return (
    <View className="mb-6">
      <Text
        variant="muted"
        className="mb-2 text-xs font-semibold uppercase tracking-wide"
      >
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
  const router = useRouter();

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border border-border"
          onPress={() => router.back()}
        >
          <HugeiconsIcon icon={ChevronDown} size={24} strokeWidth={1.5} />
        </Button>
        <Button
          size="icon"
          className="rounded-full border border-border"
          onPress={() => router.back()}
        >
          <HugeiconsIcon icon={Tick02Icon} size={24} color="#fff" />
        </Button>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text variant="muted" className="mb-4">
          Log what you want, set a wait, and we will remind you when it is time
          to decide.
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
