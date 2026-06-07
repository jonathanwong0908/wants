import { NavigationBackIcon } from "@/components/layout/navigation-back-icon";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { useRouter } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import { ScrollView, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HeaderProps = {
  title: string;
  variant?: "modal" | "sub";
};

export function SettingsScreenHeader({ title, variant = "sub" }: HeaderProps) {
  const router = useRouter();
  const palette = THEME[useColorScheme() === "dark" ? "dark" : "light"];

  return (
    <View className="flex-row items-center gap-2 px-4 pt-4">
      <Button
        variant="outline"
        size="icon"
        className="mr-1"
        onPress={() => router.back()}
        accessibilityLabel={variant === "modal" ? "Close settings" : "Back"}
      >
        {variant === "modal" ? (
          <ChevronDown size={24} color={palette.foreground} strokeWidth={1.5} />
        ) : (
          <NavigationBackIcon color={palette.foreground} />
        )}
      </Button>
      <Text className="text-xl font-bold text-foreground">{title}</Text>
    </View>
  );
}

type Props = {
  title: string;
  variant?: "modal" | "sub";
  children: React.ReactNode;
};

export function SettingsScreenShell({
  title,
  variant = "sub",
  children,
}: Props) {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <SettingsScreenHeader title={title} variant={variant} />
      <ScrollView
        className="flex-1 px-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
